// One-off setup: creates the Appwrite Storage bucket used for profile
// pictures (see app/config/appwrite-config.js -> PROFILE_IMAGES_BUCKET_ID)
// and adds the `profileImageId` string attribute to the "profiles"
// collection that Profile.jsx reads/writes via profile-service.js.
//
// Usage: APPWRITE_API_KEY=xxxxx node scripts/setup-profile-image-storage.js

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';
const DATABASE_ID = '69b6e464000e1c479de5';
const PROFILES_COLLECTION_ID = 'profiles';
const BUCKET_ID = 'profile_images';

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

async function createBucket() {
  const res = await fetch(`${ENDPOINT}/storage/buckets`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      bucketId: BUCKET_ID,
      name: 'Profile Images',
      permissions: [
        'read("users")',
        'create("users")',
        'update("users")',
        'delete("users")',
      ],
      fileSecurity: false,
      enabled: true,
      maximumFileSize: 5000000,
      allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    }),
  });

  if (res.status === 409) {
    console.log(`Bucket "${BUCKET_ID}" already exists, skipping creation.`);
    return;
  }

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Create bucket failed: ${body.message || res.status}`);
  }
  console.log(`Created bucket "${BUCKET_ID}".`);
}

async function createProfileImageAttribute() {
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${PROFILES_COLLECTION_ID}/attributes/string`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ key: 'profileImageId', size: 255, required: false }),
    }
  );

  if (res.status === 409) {
    console.log('Attribute "profileImageId" already exists, skipping creation.');
    return;
  }

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Create attribute "profileImageId" failed: ${body.message || res.status}`);
  }
  console.log('Created attribute "profileImageId".');
}

async function run() {
  await createBucket();
  await createProfileImageAttribute();
  console.log('\nDone.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
