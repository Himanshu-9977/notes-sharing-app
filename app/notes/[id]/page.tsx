"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getNote, deleteNote } from "@/lib/notesService";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface Note {
  $id?: string;
  title: string;
  content: string;
  userId?: string;
  authorName?: string;
  tags: string[];
  $createdAt?: string;
}

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchNote() {
      setIsLoading(true);
      setError("");
      try {
        const fetchedNote = await getNote(params.id);
        setNote(fetchedNote as any);
      } catch (error) {
        console.error("Error fetching note:", error);
        setError("Failed to load the note. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchNote();
  }, [params.id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      setIsDeleting(true);
      try {
        await deleteNote(params.id);
        router.push("/notes");
      } catch (error) {
        console.error("Error deleting note:", error);
        setError("Failed to delete the note. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!note) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Note not found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{note.title}</h1>
        {user && user.$id === note.userId && (
          <div className="space-x-2">
            <Button asChild variant="outline" disabled={isDeleting}>
              <Link href={`/notes/${note.$id}/edit`}>Edit Note</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Note"}
            </Button>
          </div>
        )}
      </div>
      <div className="text-muted-foreground">
        By {note.userId} | Created on{" "}
        {note.$createdAt ? new Date(note.$createdAt).toLocaleDateString() : ""}
      </div>
      <div className="prose dark:prose-invert max-w-none">{note.content}</div>
    </div>
  );
}
