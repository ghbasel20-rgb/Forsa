import { Account, Client, Databases, ID, Query, Storage } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('699194ee000ccfb4ae0b');

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const PROFILE_IMAGES_BUCKET_ID = 'profile_images';

export { account, client, databases, storage, ID, Query };
