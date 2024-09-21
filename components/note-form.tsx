'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createNote, updateNote } from '@/lib/notesService'
import { useAuth } from '@/hooks/useAuth'

interface NoteFormProps {
  initialData?: { id: string; title: string; content: string };
}

export default function NoteForm({ initialData }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      console.error('User not authenticated')
      return
    }

    try {
      if (initialData) {
        await updateNote(initialData.id, title, content)
      } else {
        await createNote(title, content, user.$id)
      }
      router.push('/notes')
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
        />
      </div>
      <Button type="submit">Save Note</Button>
    </form>
  )
}