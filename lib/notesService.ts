import { database } from './appwrite';
import { ID } from 'appwrite';

if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || !process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_APPWRITE_DATABASE_ID or NEXT_PUBLIC_APPWRITE_COLLECTION_ID");
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;



export async function createNote(title: string, content: string, userId: string) {
  return database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    title,
    content,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}


export async function getNotes() {
  const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID);
  return response.documents;
}

export async function getNote(id: string) {
  return database.getDocument(DATABASE_ID, COLLECTION_ID, id);
}

export async function updateNote(id: string, title: string, content: string) {
  return database.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
    title,
    content,
    updatedAt: new Date().toISOString(),
  });
}


export async function deleteNote(id: string) {
  return database.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
}