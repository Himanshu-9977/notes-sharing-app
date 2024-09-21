'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import NoteCard from '@/components/note-card'
import { getNotes } from '@/lib/notesService'

export default function NotesPage() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    async function fetchNotes() {
      try {
        const fetchedNotes = await getNotes()
        setNotes(fetchedNotes as any)
      } catch (error) {
        console.error('Error fetching notes:', error)

      }
    }
    fetchNotes()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">All Notes</h1>
        <Button asChild>
          <Link href="/notes/create">Create New Note</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard key={note.$id} note={note} />
        ))}
      </div>
    </div>
  )
}