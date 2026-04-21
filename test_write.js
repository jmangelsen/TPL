import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = admin.initializeApp({ projectId: firebaseConfig.projectId });
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function check() {
  try {
    await db.collection('company_news').doc('test').set({
      companyId: "test",
      headline: "test",
      source: "test",
      url: "test",
      publishedAt: new Date().toISOString(),
      summary: "test",
      createdAt: new Date().toISOString()
    });
    console.log("Write successful");
  } catch (e) {
    console.error(e.message);
  }
}
check();
