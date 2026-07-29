// One-off: marks 5 random documents in each of the "opportunities" and
// "events" Firestore collections as forsaApproved: true, so the new Forsa
// Approved icon/filter (see app/Events.jsx, app/Allopportunities.jsx,
// app/EventDetail.jsx, app/Opportunitydetail.jsx) has real data to show.
// Signs in as a throwaway account only to satisfy the Firestore write rule
// (`allow write: if request.auth != null`), then deletes that account again.
//
// Usage: node scripts/mark-forsa-approved.mjs

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
} from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

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

const pickRandom = (items, count) => {
  const pool = [...items];
  const picked = [];
  while (pool.length > 0 && picked.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
};

async function markApproved(collectionId) {
  const snapshot = await getDocs(collection(db, collectionId));
  const picked = pickRandom(snapshot.docs, 5);

  for (const docSnap of picked) {
    await updateDoc(doc(db, collectionId, docSnap.id), { forsaApproved: true });
    console.log(`Marked ${collectionId}/${docSnap.id} - ${docSnap.data().title} as forsaApproved`);
  }

  return picked.length;
}

async function run() {
  const tempEmail = `forsa-approved-seed-${Date.now()}@example.com`;
  const credential = await createUserWithEmailAndPassword(auth, tempEmail, 'Temp-password-123!');

  try {
    const opportunitiesCount = await markApproved('opportunities');
    const eventsCount = await markApproved('events');
    console.log(`\nDone. Marked ${opportunitiesCount} opportunities and ${eventsCount} events as Forsa Approved.`);
  } finally {
    await deleteUser(credential.user);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
