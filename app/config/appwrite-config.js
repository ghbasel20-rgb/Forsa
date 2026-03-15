import { Account, Client, Databases, ID, Query } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('699194ee000ccfb4ae0b');

const account = new Account(client);
const databases = new Databases(client);

export { account, client, databases, ID, Query };
