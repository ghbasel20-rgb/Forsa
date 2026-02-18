import { Account, Client, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('699194ee000ccfb4ae0b'); 

const account = new Account(client);

export { account, client, ID };

