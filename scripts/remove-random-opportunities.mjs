// One-off: permanently deletes 11 randomly-chosen documents from the
// "opportunities" Firestore collection, excluding the MEET opportunity.
// Signs in as a throwaway account only to satisfy the Firestore write rule
// (`allow write: if request.auth != null`), then deletes that account again.
//
// Usage: node scripts/remove-random-opportunities.mjs

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
} from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCcqgciD-7JtfRFY_RUzNMPvV5pZNDWyws',
  authDomain: 'forsa-a5848.firebaseapp.com',
  projectId: 'forsa-a5848',
  storageBucket: 'forsa-a5848.firebasestorage.app',
  messagingSenderId: '1095418919674',
  appId: '1:1095418919674:web:3fbc2c0811a3465674a743',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const REMOVE_COUNT = 11;

const pickRandom = (items, count) => {
  const pool = [...items];
  const picked = [];
  while (pool.length > 0 && picked.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
};

async function run() {
  const tempEmail = `remove-opportunities-seed-${Date.now()}@example.com`;
  const credential = await createUserWithEmailAndPassword(auth, tempEmail, 'Temp-password-123!');

  try {
    const snapshot = await getDocs(collection(db, 'opportunities'));
    const candidates = snapshot.docs.filter((docSnap) => docSnap.data().title !== 'MEET - Middle East Entrepreneurs of Tomorrow');
    const picked = pickRandom(candidates, REMOVE_COUNT);

    for (const docSnap of picked) {
      await deleteDoc(doc(db, 'opportunities', docSnap.id));
      console.log(`Deleted opportunities/${docSnap.id} - ${docSnap.data().title}`);
    }

    console.log(`\nDone. Deleted ${picked.length} of ${candidates.length} eligible opportunities.`);
  } finally {
    await deleteUser(credential.user);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
