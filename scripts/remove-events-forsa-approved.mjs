// One-off: removes the forsaApproved flag from every event in the "events"
// Firestore collection. The flag was only ever set randomly by
// mark-forsa-approved.mjs to have sample data for the badge/filter UI, not
// because those events were actually vetted by Forsa.
// Signs in as a throwaway account only to satisfy the Firestore write rule
// (`allow write: if request.auth != null`), then deletes that account again.
//
// Usage: node scripts/remove-events-forsa-approved.mjs

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
} from 'firebase/auth';
import {
  collection,
  deleteField,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

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

async function run() {
  const tempEmail = `remove-approved-seed-${Date.now()}@example.com`;
  const credential = await createUserWithEmailAndPassword(auth, tempEmail, 'Temp-password-123!');

  try {
    const snapshot = await getDocs(collection(db, 'events'));
    const approved = snapshot.docs.filter((docSnap) => docSnap.data().forsaApproved);

    for (const docSnap of approved) {
      await updateDoc(doc(db, 'events', docSnap.id), { forsaApproved: deleteField() });
      console.log(`Removed forsaApproved from events/${docSnap.id} - ${docSnap.data().title}`);
    }

    console.log(`\nDone. Removed forsaApproved from ${approved.length} event(s).`);
  } finally {
    await deleteUser(credential.user);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
