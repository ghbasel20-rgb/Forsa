// One-time data migration: copies the "events" and "opportunities"
// collections from Appwrite into Firestore, preserving document IDs so
// existing links (e.g. eventId params in routes) keep working.
//
// Only these two content collections are migrated. "profiles",
// "savedEvents", and "savedOpportunities" are keyed by Appwrite user IDs,
// and this migration does not recreate Appwrite Auth users in Firebase
// (see conversation/README) -- so migrating those collections would just
// produce rows nothing can ever look up. Users sign up fresh in the
// Firebase-backed app.
//
// Usage:
//   APPWRITE_API_KEY=xxxxx FIREBASE_SERVICE_ACCOUNT=./service-account.json node scripts/migrate-appwrite-to-firestore.mjs

import { readFileSync } from 'node:fs';
import admin from 'firebase-admin';

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';
const COLLECTIONS = ['events', 'opportunities'];

const apiKey = process.env.APPWRITE_API_KEY;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY environment variable.');
  process.exit(1);
}
if (!serviceAccountPath) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT environment variable (path to service account JSON).');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const headers = {
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': apiKey,
};

async function fetchAllDocuments(collectionId) {
  const documents = [];
  let cursor = null;

  for (;;) {
    const queries = ['limit(100)'];
    if (cursor) queries.push(`cursorAfter("${cursor}")`);
    const qs = queries.map((q) => `queries[]=${encodeURIComponent(q)}`).join('&');

    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents?${qs}`,
      { headers }
    );
    const body = await res.json();
    if (!res.ok) {
      throw new Error(`List ${collectionId} failed: ${body.message || res.status}`);
    }

    documents.push(...body.documents);
    if (body.documents.length < 100) break;
    cursor = body.documents[body.documents.length - 1].$id;
  }

  return documents;
}

function toFirestoreDoc(appwriteDoc) {
  const {
    $id,
    $createdAt,
    $updatedAt,
    $collectionId,
    $databaseId,
    $permissions,
    ...fields
  } = appwriteDoc;

  return {
    id: $id,
    data: {
      ...fields,
      createdAt: $createdAt ? admin.firestore.Timestamp.fromDate(new Date($createdAt)) : admin.firestore.FieldValue.serverTimestamp(),
    },
  };
}

async function migrateCollection(collectionId) {
  console.log(`Fetching "${collectionId}" from Appwrite...`);
  const documents = await fetchAllDocuments(collectionId);
  console.log(`  found ${documents.length} document(s)`);

  const batch = db.batch();
  for (const appwriteDoc of documents) {
    const { id, data } = toFirestoreDoc(appwriteDoc);
    batch.set(db.collection(collectionId).doc(id), data);
  }
  await batch.commit();

  console.log(`  wrote ${documents.length} document(s) to Firestore "${collectionId}"`);
}

async function run() {
  for (const collectionId of COLLECTIONS) {
    await migrateCollection(collectionId);
  }
  console.log('\nDone.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
