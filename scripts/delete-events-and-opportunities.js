// One-off cleanup: deletes ALL documents in the "events" and "opportunities"
// collections. Intended to be run immediately before re-seeding those
// collections with the Arabic content in seed-events.js, seed-opportunities.js,
// and seed-more-opportunities.js, so the re-seed doesn't create duplicates
// alongside the old English documents.
//
// DESTRUCTIVE: this permanently deletes every event and opportunity document.
// Run only when you intend to immediately re-seed.
//
// Usage: APPWRITE_API_KEY=xxxxx node scripts/delete-events-and-opportunities.js

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';
const COLLECTIONS = ['events', 'opportunities'];

const apiKey = process.env.APPWRITE_API_KEY;
if (!apiKey) {
  console.error('Missing APPWRITE_API_KEY environment variable.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': apiKey,
};

async function listDocuments(collectionId) {
  const limitQuery = JSON.stringify({ method: 'limit', values: [100] });
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents?queries[]=${encodeURIComponent(limitQuery)}`,
    { headers }
  );
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`List "${collectionId}" failed: ${body.message || res.status}`);
  }
  return body.documents;
}

async function deleteDocument(collectionId, documentId) {
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents/${documentId}`,
    { method: 'DELETE', headers }
  );
  if (!res.ok && res.status !== 404) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
}

async function clearCollection(collectionId) {
  let deleted = 0;
  let failed = 0;

  // Loop in case a collection has more than 100 documents (list is capped per page).
  while (true) {
    const documents = await listDocuments(collectionId);
    if (documents.length === 0) break;

    for (const doc of documents) {
      try {
        await deleteDocument(collectionId, doc.$id);
        deleted += 1;
      } catch (error) {
        console.error(`Failed to delete "${collectionId}/${doc.$id}": ${error.message}`);
        failed += 1;
      }
    }
  }

  console.log(`"${collectionId}": deleted ${deleted}, failed ${failed}.`);
}

async function run() {
  for (const collectionId of COLLECTIONS) {
    await clearCollection(collectionId);
  }
  console.log('\nDone.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
