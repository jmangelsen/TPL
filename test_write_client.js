import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function check() {
  try {
    await setDoc(doc(db, 'company_news', 'test2'), {
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
