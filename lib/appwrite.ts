import { Client, Account, Databases } from 'appwrite';

let client: Client;

try {
  if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    throw new Error('Appwrite environment variables are not set');
  }

  client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    
} catch (error) {
  console.error('Failed to initialize Appwrite client:', error);
  // You might want to set a default client or handle this error in a way that makes sense for your app
  client = new Client();
}

export const account = new Account(client);
export const database = new Databases(client);
