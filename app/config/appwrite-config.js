import { Account, Client, Databases, ID, Query } from 'appwrite';
import { Client as RNClient, Storage as RNStorage } from 'react-native-appwrite';

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '699194ee000ccfb4ae0b';

const client = new Client();

client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

// Storage uploads need react-native-appwrite: unlike the `appwrite` web SDK
// (which requires a browser `File`/Blob), it accepts React Native
// `{ uri, name, type }` file objects straight from expo-image-picker. It
// shares the same session cookie (native networking handles cookies
// per-domain, not per Client instance), so this stays authenticated as the
// current user.
const storageClient = new RNClient();
storageClient.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const storage = new RNStorage(storageClient);

export const PROFILE_IMAGES_BUCKET_ID = 'profile_images';

export { account, client, databases, storage, ID, Query };
