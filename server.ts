import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import { Parser } from "json2csv";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf-8"));

// Initialize Firebase Admin
const app = admin.initializeApp({
  projectId: firebaseConfig.projectId
});
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testConnection() {
  try {
    await db.collection('test').doc('connection').get();
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
      // Check if already subscribed
      const subscribersRef = db.collection("subscribers");
      const querySnapshot = await subscribersRef.where("email", "==", email).limit(1).get();
      
      if (!querySnapshot.empty) {
        return res.status(200).json({ message: "Already subscribed" });
      }

      await subscribersRef.add({ 
        email, 
        date: new Date().toISOString() 
      });
      
      console.log(`New subscriber added to Firestore: ${email}`);
      res.status(200).json({ message: "Subscription successful" });
    } catch (error) {
      console.error("Error adding subscriber to Firestore:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/reports/request", async (req, res) => {
    const { persona, name, email, organization, instructions } = req.body;
    
    if (!persona || !name || !email || !organization || !instructions) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Store in Firestore
      const requestsRef = db.collection("report_requests");
      await requestsRef.add({
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
    
    try {
      const subscribersRef = db.collection("subscribers");
      const querySnapshot = await subscribersRef.get();
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
