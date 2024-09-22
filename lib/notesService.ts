import { database } from './appwrite';
import { ID } from 'appwrite';

if (!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || !process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_APPWRITE_DATABASE_ID or NEXT_PUBLIC_APPWRITE_COLLECTION_ID");
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

export interface Note {
  $id: string;
  title: string;
  content: string;
  userId: string;
  authorName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export async function createNote(title: string, content: string, userId: string, authorName: string, tags: string[] = []) {
  return database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    title,
    content,
    userId,
    authorName,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getNotes(): Promise<Note[]> {
  const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID);
  return response.documents.map(doc => ({
    $id: doc.$id,
    title: doc.title,
    content: doc.content,
    userId: doc.userId,
    authorName: doc.authorName,
    tags: doc.tags,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }));
}

export async function getNote(id: string): Promise<Note> {
  const doc = await database.getDocument(DATABASE_ID, COLLECTION_ID, id);
  return {
    $id: doc.$id,
    title: doc.title,
    content: doc.content,
    userId: doc.userId,
    authorName: doc.authorName,
    tags: doc.tags,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function updateNote(id: string, title: string, content: string, tags: string[] = []): Promise<Note> {
  const doc = await database.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
    title,
    content,
    tags,
    updatedAt: new Date().toISOString(),
  });
  return {
    $id: doc.$id,
    title: doc.title,
    content: doc.content,
    userId: doc.userId,
    authorName: doc.authorName,
    tags: doc.tags,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function deleteNote(id: string) {
  return database.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
}