'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createNote, updateNote } from '@/lib/notesService'
import { useAuth } from '@/hooks/useAuth'

interface NoteFormProps {
  initialData?: { id: string; title: string; content: string; tags: string[] };
}

export default function NoteForm({ initialData }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('User not authenticated. Please log in and try again.')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (initialData) {
        await updateNote(initialData.id, title, content, tags)
        setSuccess('Note updated successfully!')
      } else {
        await createNote(title, content, user.$id, user.name || user.email || 'Unknown User', tags)
        setSuccess('Note created successfully!')
      }
      // Wait for a short time to show the success message before redirecting
      setTimeout(() => {
        router.push('/notes')
      }, 1500)
    } catch (error) {
      console.error('Error saving note:', error)
      setError('Failed to save the note. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default" className="bg-green-100 border-green-400 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex space-x-2">
          <Input
            id="tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            disabled={isLoading}
          />
          <Button type="button" onClick={addTag} disabled={isLoading}>Add Tag</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : (initialData ? 'Update Note' : 'Create Note')}
      </Button>
    </form>
  )
}