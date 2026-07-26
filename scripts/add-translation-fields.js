// One-off migration: adds `titleAr`/`descriptionAr` string attributes to the
// Appwrite "opportunities" collection, and `titleAr`/`detailsAr`/`contentAr`
// to the "events" collection (events has no single `description` field —
// EventDetail.jsx renders both `details` and `content`, so both get an
// Arabic counterpart). These are cache slots: app/services/opportunities-service.js
// (getOpportunityWithTranslation) and app/services/events-service.js
// (getEventWithTranslation) fill them in lazily via MyMemory the first time
// a document is viewed with Arabic selected — no backfill needed here.
//
// Usage: APPWRITE_API_KEY=xxxxx node scripts/add-translation-fields.js

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';
const OPPORTUNITIES_COLLECTION_ID = 'opportunities';
const EVENTS_COLLECTION_ID = 'events';

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

async function createStringAttribute(collectionId, key, size) {
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/string`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ key, size, required: false }),
    }
  );

  if (res.status === 409) {
    console.log(`Attribute "${key}" already exists on "${collectionId}", skipping creation.`);
    return;
  }

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Create attribute "${key}" on "${collectionId}" failed: ${body.message || res.status}`);
  }
  console.log(`Created attribute "${key}" on "${collectionId}".`);
}

async function waitForAttribute(collectionId, key) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/${key}`,
      { headers }
    );
    const body = await res.json();
    if (res.ok && body.status === 'available') {
      console.log(`Attribute "${key}" on "${collectionId}" is available.`);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(`Attribute "${key}" on "${collectionId}" did not become available in time.`);
}

async function run() {
  await createStringAttribute(OPPORTUNITIES_COLLECTION_ID, 'titleAr', 500);
  await createStringAttribute(OPPORTUNITIES_COLLECTION_ID, 'descriptionAr', 5000);
  await createStringAttribute(EVENTS_COLLECTION_ID, 'titleAr', 500);
  await createStringAttribute(EVENTS_COLLECTION_ID, 'detailsAr', 5000);
  await createStringAttribute(EVENTS_COLLECTION_ID, 'contentAr', 5000);

  await waitForAttribute(OPPORTUNITIES_COLLECTION_ID, 'titleAr');
  await waitForAttribute(OPPORTUNITIES_COLLECTION_ID, 'descriptionAr');
  await waitForAttribute(EVENTS_COLLECTION_ID, 'titleAr');
  await waitForAttribute(EVENTS_COLLECTION_ID, 'detailsAr');
  await waitForAttribute(EVENTS_COLLECTION_ID, 'contentAr');

  console.log('\nDone. Translation cache fields are ready.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
