import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = admin.initializeApp({ projectId: firebaseConfig.projectId });
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function check() {
  try {
    const snapshot = await db.collection('company_news').limit(1).get();
    console.log("News count:", snapshot.size);
    if (!snapshot.empty) {
      console.log("Sample news:", snapshot.docs[0].data());
    }
  } catch (e) {
    console.error(e.message);
  }
}
check();
