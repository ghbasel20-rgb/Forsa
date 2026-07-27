// One-off: creates a single test event with a near-future eventDate, skills,
// and interests, so the Homepage "Upcoming events" widget (and its
// match-prioritization) has something real to render. Signs in as a
// throwaway account only to satisfy the Firestore write rule
// (`allow write: if request.auth != null` on events), then deletes that
// account again.
//
// Usage: node scripts/create-test-event.mjs

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
} from 'firebase/auth';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

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

const eventDate = new Date();
eventDate.setDate(eventDate.getDate() + 5);

async function run() {
  const tempEmail = `test-event-seed-${Date.now()}@example.com`;
  const credential = await createUserWithEmailAndPassword(auth, tempEmail, 'Temp-password-123!');

  try {
    const docRef = await addDoc(collection(db, 'events'), {
      title: 'Test Coding Workshop',
      titleAr: 'ورشة برمجة تجريبية',
      details: 'A test event created to verify the Upcoming Events widget.',
      detailsAr: 'فعالية تجريبية لاختبار قسم الفعاليات القادمة.',
      content: 'This is placeholder content for a test event with a real upcoming date.',
      contentAr: 'هذا محتوى تجريبي لفعالية اختبارية بتاريخ قادم فعلي.',
      location: 'Ramallah Community Center',
      locationAr: 'مركز رام الله المجتمعي',
      ageRange: 'All ages',
      cost: 'Free',
      costAr: 'مجاناً',
      skills: ['Programming', 'Web Development'],
      interests: ['Technology'],
      eventDate: eventDate.toISOString(),
      createdAt: serverTimestamp(),
    });

    console.log(`Created test event ${docRef.id} with eventDate ${eventDate.toISOString()}`);
  } finally {
    await deleteUser(credential.user);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
