'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { getNote, deleteNote } from '@/lib/notesService'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const [note, setNote] = useState(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchNote() {
      try {
        const fetchedNote = await getNote(params.id)
        setNote(fetchedNote as any)
      } catch (error) {
        console.error('Error fetching note:', error)
      }
    }
    fetchNote()
  }, [params.id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(params.id)
        router.push('/notes')
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }
  }

  if (!note) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{note?.title}</h1>
        {user && user.$id === note?.userId && (
          <div className="space-x-2">
            <Button asChild variant="outline">
              <Link href={`/notes/${note?.$id}/edit`}>Edit Note</Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Note</Button>
          </div>
        )}
      </div>
      <div className="text-muted-foreground">
        By {note?.userId} | Created on {note?.$createdAt ? new Date(note.$createdAt).toLocaleDateString() : ''}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        {note?.content}
      </div>
    </div>
  )
}