// One-off (safe to re-run) migration: backfills the Arabic `Ar`-suffixed
// cache fields - titleAr/descriptionAr on "opportunities", titleAr/detailsAr/
// contentAr on "events" - for every existing document that doesn't already
// have a usable one. These are the same fields app/services/opportunities-
// service.js and app/services/events-service.js populate lazily on first
// Arabic view (getOpportunityWithTranslation / getEventWithTranslation);
// this script just pre-fills the backlog so users don't wait on a live
// translation call. Imports the real translateText from
// app/services/translation-service.js so the migration and the live app
// agree on what counts as a usable translation - app/services/package.json
// marks that directory as an ES module so this .mjs script can import it
// directly.
//
// Usage: APPWRITE_API_KEY=xxxxx node scripts/translate-content.mjs

import { translateText } from '../app/services/translation-service.js';

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';

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

const isUsableTranslation = (text) => Boolean(text) && !/MYMEMORY WARNING/i.test(text);

async function listAllDocuments(collectionId) {
  const documents = [];
  let offset = 0;

  while (true) {
    const limitQuery = JSON.stringify({ method: 'limit', values: [100] });
    const offsetQuery = JSON.stringify({ method: 'offset', values: [offset] });
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents?queries[]=${encodeURIComponent(limitQuery)}&queries[]=${encodeURIComponent(offsetQuery)}`,
      { headers }
    );
    const body = await res.json();
    if (!res.ok) {
      throw new Error(`List "${collectionId}" failed: ${body.message || res.status}`);
    }

    documents.push(...body.documents);
    if (body.documents.length < 100) break;
    offset += 100;
  }

  return documents;
}

async function updateDocument(collectionId, documentId, data) {
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents/${documentId}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ data }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  return body;
}

async function translateFields(doc, fields) {
  const updates = {};

  for (const field of fields) {
    const arField = `${field}Ar`;
    if (isUsableTranslation(doc[arField]) || !doc[field]) {
      continue;
    }

    const translated = await translateText(doc[field], 'ar');
    if (isUsableTranslation(translated)) {
      updates[arField] = translated;
    }
  }

  return updates;
}

async function migrateCollection(collectionId, fields) {
  const documents = await listAllDocuments(collectionId);
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const doc of documents) {
    const label = doc.title || doc.$id;
    const updates = await translateFields(doc, fields);

    if (Object.keys(updates).length === 0) {
      console.log(`Skipped (already translated): ${collectionId}/${doc.$id} - ${label}`);
      skipped += 1;
      continue;
    }

    try {
      await updateDocument(collectionId, doc.$id, updates);
      console.log(`Translated: ${collectionId}/${doc.$id} - ${label} (${Object.keys(updates).join(', ')})`);
      updated += 1;
    } catch (error) {
      console.error(`Failed: ${collectionId}/${doc.$id} - ${label}: ${error.message}`);
      failed += 1;
    }
  }

  console.log(`"${collectionId}": translated ${updated}, skipped ${skipped}, failed ${failed}.\n`);
}

async function run() {
  await migrateCollection('opportunities', ['title', 'description']);
  await migrateCollection('events', ['title', 'details', 'content']);
  console.log('Done.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
