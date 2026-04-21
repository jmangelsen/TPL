import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import { Parser } from "json2csv";
import nodemailer from "nodemailer";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, query, where, limit, deleteDoc, writeBatch, getDoc } from "firebase/firestore";
import fs from "fs";
import cors from "cors";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf-8"));

// Initialize Firebase Client SDK
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const NEWSAPI_API_KEY = process.env.NEWSAPI_API_KEY || "481562ced8724d2b966b8e3969fb10f8";
const NEWSAPI_BASE_URL = process.env.NEWSAPI_BASE_URL || "https://newsapi.org/v2";

async function fetchCompanyNews(companyId: string, query: string, fromHours = 48, pageSize = 20) {
  try {
    const fromDate = new Date(Date.now() - fromHours * 60 * 60 * 1000).toISOString();
    const url = `${NEWSAPI_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&from=${fromDate}`;
    
    const response = await fetch(url, {
      headers: { 'X-Api-Key': NEWSAPI_API_KEY }
    });

    if (!response.ok) {
      console.error(`NewsAPI error for ${companyId}:`, await response.text());
      return [];
    }

    const data = await response.json();
    return data.articles.map((article: any) => ({
      headline: article.title,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
      summary: (article.description || article.content || '').substring(0, 200).replace(/<[^>]*>?/gm, ''),
    }));
  } catch (error) {
    console.error(`Failed to fetch news for ${companyId}:`, error);
    return [];
  }
}

async function refreshCompanyNews() {
  console.log("Starting Company News refresh job...");
  try {
    // Dynamically import to get the latest config
    const { companies } = await import('./src/lib/marketTrackerData.js');
    
    let opCount = 0;
    let batch = writeBatch(db);

    for (const company of companies) {
      if (!company.newsQuery) continue;
      
      const articles = await fetchCompanyNews(company.slug, company.newsQuery, 48, 20);
      console.log(`Fetched ${articles.length} articles for ${company.slug}`);

      for (const article of articles) {
        if (!article.url) continue;
        const urlHash = crypto.createHash('md5').update(article.url).digest('hex');
        const docId = `${company.slug}_${urlHash}`;
        const docRef = doc(db, 'company_news', docId);
        
        batch.set(docRef, {
          companyId: company.slug,
          ...article,
          createdAt: new Date().toISOString()
        }, { merge: true });
        
        opCount++;
        if (opCount >= 400) {
          await batch.commit();
          batch = writeBatch(db);
          opCount = 0;
        }
      }
      
      // Simple delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (opCount > 0) {
      await batch.commit();
    }

    // Cleanup old news (> 10 days)
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    const oldNewsQuery = query(collection(db, 'company_news'), where('publishedAt', '<', tenDaysAgo));
    const oldNewsSnapshot = await getDocs(oldNewsQuery);
    if (!oldNewsSnapshot.empty) {
      let deleteBatch = writeBatch(db);
      let deleteCount = 0;
      for (const document of oldNewsSnapshot.docs) {
        deleteBatch.delete(document.ref);
        deleteCount++;
        if (deleteCount >= 400) {
          await deleteBatch.commit();
          deleteBatch = writeBatch(db);
          deleteCount = 0;
        }
      }
      if (deleteCount > 0) {
        await deleteBatch.commit();
      }
      console.log(`Deleted ${oldNewsSnapshot.size} old news articles.`);
    }

    console.log("Company News refresh job completed.");
  } catch (error) {
    console.error("Error in refreshCompanyNews job:", error);
  }
}

// Schedule cron for every 8 hours on weekdays
cron.schedule("0 */8 * * 1-5", refreshCompanyNews);

async function testConnection() {
  try {
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    console.log("Firestore connection test successful.");
  } catch (error) {
    console.error("Firestore connection test error:", error);
  }
}
testConnection();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  // Enable CORS for all origins to allow external fetch, curl, and AI tools
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'User-Agent', 'Accept']
  }));

  // Basic Security Headers (LLM/Bot friendly, iframe friendly)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // API Routes
  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    try {
      // Use email as document ID to avoid needing to read (which is restricted)
      const subscriberDoc = doc(db, "subscribers", email);
      await setDoc(subscriberDoc, { 
        email, 
        date: new Date().toISOString() 
      });
      
      console.log(`New subscriber added to Firestore: ${email}`);
      res.status(200).json({ message: "Subscription successful" });
    } catch (error) {
      // If it fails due to permissions, it might be because the document already exists
      // and update is not allowed, which means they are already subscribed.
      console.error("Error adding subscriber to Firestore:", error);
      res.status(200).json({ message: "Subscription successful or already subscribed" });
    }
  });

  // Explicit route for sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });

  app.post("/api/news/refresh", async (req, res) => {
    refreshCompanyNews().catch(console.error);
    res.status(200).json({ message: "News refresh job started in background" });
  });

  app.post("/api/reports/request", async (req, res) => {
    const { persona, name, email, organization, instructions } = req.body;
    
    if (!persona || !name || !email || !organization || !instructions) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Store in Firestore
      const newRequestRef = doc(collection(db, "report_requests"));
      await setDoc(newRequestRef, {
        persona,
        name,
        email,
        organization,
        instructions,
        date: new Date().toISOString()
      });

      // Send Email
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: '"The Physical Layer" <Research@aiphysicallayer.net>',
        to: "Research@aiphysicallayer.net",
        subject: `New Report Request: ${persona}`,
        text: `
A new report request has been received from the TPL website.

Persona: ${persona}
Name: ${name}
Email: ${email}
Organization: ${organization}

Instructions:
${instructions}
        `,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1a2633;">
            <h2 style="color: #2563eb; text-transform: uppercase;">New Report Request: ${persona}</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Organization:</strong> ${organization}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p><strong>Instructions:</strong></p>
            <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 4px;">${instructions}</p>
          </div>
        `
      };

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log(`Report request emailed successfully to Research@aiphysicallayer.net`);
      } else {
        console.log("SMTP credentials missing. Request stored in Firestore but not emailed.");
      }

      res.status(200).json({ message: "Request received successfully" });
    } catch (error) {
      console.error("Error processing report request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // 72-hour CSV export task (runs at midnight every 3 days)
  cron.schedule("0 0 */3 * *", async () => {
    console.log("Generating 72-hour subscriber CSV export from Firestore...");
    console.log("Note: In this environment without a Service Account, the backend cannot bypass Firestore security rules to read all subscribers.");
    console.log("Please export subscribers directly from the Firebase Console.");
    
    /*
    try {
      const subscribersRef = collection(db, "subscribers");
      const querySnapshot = await getDocs(subscribersRef);
      const subscribersData = querySnapshot.docs.map(doc => doc.data());

      if (subscribersData.length === 0) {
        console.log("No subscribers to export.");
        return;
      }

      const parser = new Parser();
      const csv = parser.parse(subscribersData);
      
      // Email configuration
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: '"The Physical Layer" <Research@aiphysicallayer.net>',
        to: "Research@aiphysicallayer.net",
        subject: "Subscriber Export - 72 Hour Report",
        text: "Please find the attached CSV file containing the latest subscribers.",
        attachments: [
          {
            filename: `subscribers_${new Date().toISOString().split('T')[0]}.csv`,
            content: csv,
          },
        ],
      };

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log("CSV export emailed successfully to Research@aiphysicallayer.net");
      } else {
        console.log("SMTP credentials missing. CSV generated but not emailed.");
        console.log("CSV Content Preview:\n", csv.substring(0, 200));
      }
    } catch (error) {
      console.error("Error during CSV export:", error);
    }
    */
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files with proper caching
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          // Never cache HTML files to ensure users always get the latest asset links
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else if (filePath.includes('/assets/')) {
          // Cache hashed assets (CSS/JS) for 1 year
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));

    // Fallback for SPA routing
    app.get("*", (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
