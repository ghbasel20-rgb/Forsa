// Backfills the Arabic `Ar`-suffixed cache fields on Firestore's "events"
// and "opportunities" collections, for every document that doesn't already
// have a usable one. These are the same fields app/services/events-service.js
// and app/services/opportunities-service.js populate lazily on first Arabic
// view -- this script just pre-fills the backlog (including migrated
// documents, which came from Appwrite without most of these fields set) so
// users don't wait on a live translation call per item. Safe to re-run.
//
// Usage: FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json node scripts/backfill-translations-firestore.mjs

import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { translateText } from '../app/services/translation-service.js';

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountPath) {
  console.error('Missing FIREBASE_SERVICE_ACCOUNT environment variable (path to service account JSON).');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const isUsableTranslation = (text) =>
  Boolean(text) && !/MYMEMORY WARNING/i.test(text) && !/%\s{0,3}[0-9A-Fa-f]{2}/.test(text);

async function translateFields(data, fields, arrayFields = []) {
  const updates = {};

  for (const field of fields) {
    const arField = `${field}Ar`;
    if (isUsableTranslation(data[arField]) || !data[field]) {
      continue;
    }

    const translated = await translateText(data[field], 'ar');
    if (isUsableTranslation(translated)) {
      updates[arField] = translated;
    }
  }

  for (const field of arrayFields) {
    const arField = `${field}Ar`;
    const values = data[field] || [];
    if (values.length === 0) {
      continue;
    }

    const cached = data[arField];
    const cachedUsable =
      Array.isArray(cached) && cached.length === values.length && cached.every(isUsableTranslation);
    if (cachedUsable) {
      continue;
    }

    const translated = [];
    for (const value of values) {
      translated.push(await translateText(value, 'ar'));
    }

    if (translated.every(isUsableTranslation)) {
      updates[arField] = translated;
    }
  }

  return updates;
}

async function backfillCollection(collectionId, fields, arrayFields = []) {
  const snapshot = await db.collection(collectionId).get();
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const label = data.title || docSnap.id;
    const updates = await translateFields(data, fields, arrayFields);

    if (Object.keys(updates).length === 0) {
      console.log(`Skipped (already translated): ${collectionId}/${docSnap.id} - ${label}`);
      skipped += 1;
      continue;
    }

    try {
      await docSnap.ref.update(updates);
      console.log(`Translated: ${collectionId}/${docSnap.id} - ${label} (${Object.keys(updates).join(', ')})`);
      updated += 1;
    } catch (error) {
      console.error(`Failed: ${collectionId}/${docSnap.id} - ${label}: ${error.message}`);
      failed += 1;
    }
  }

  console.log(`"${collectionId}": translated ${updated}, skipped ${skipped}, failed ${failed}.\n`);
}

async function run() {
  await backfillCollection('opportunities', ['title', 'description', 'location', 'category'], ['requirements']);
  await backfillCollection('events', ['title', 'details', 'content', 'location', 'cost']);
  console.log('Done.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
