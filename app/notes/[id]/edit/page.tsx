'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getNote } from '@/lib/notesService'
import NoteForm from '@/components/note-form'
import { useAuth } from '@/hooks/useAuth'
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define the Note type if not already defined
interface Note {
  $id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
}

export default function EditNotePage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState<Note | null>(null) // Set type to Note or null
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchNote() {
      try {
        const fetchedNote = await getNote(params.id)
        setNote(fetchedNote) // This should now work correctly
      } catch (error) {
        console.error('Error fetching note:', error)
        setError('Failed to load the note. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchNote()
  }, [params.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!note) {
    return <div>Note not found</div>
  }

  if (user?.$id !== note.userId) {
    return <div>You don&apos;t have permission to edit this note.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
      <NoteForm initialData={{
        id: note.$id,
        title: note.title,
        content: note.content,
        tags: note.tags
      }} />
    </div>
  )
}
