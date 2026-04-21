import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function check() {
  try {
    const q = query(collection(db, 'company_news'), limit(1));
    const snapshot = await getDocs(q);
    console.log("News count:", snapshot.size);
    if (!snapshot.empty) {
      console.log("Sample news:", snapshot.docs[0].data());
    }
  } catch (e) {
    console.error(e.message);
  }
}
check();
