import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = initializeApp({ projectId: firebaseConfig.projectId });
console.log("App initialized.");
try {
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  console.log("Firestore initialized.");
} catch (e: any) {
  console.log("Error:", e.message);
}
