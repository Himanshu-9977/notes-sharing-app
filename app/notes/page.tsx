"use client"
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import NoteCard from '@/components/note-card'
import { getNotes, Note } from '@/lib/notesService'
import { useAuth } from '@/hooks/useAuth'
import NoteFilter from '@/components/note-filter'

export default function NotesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <NotesContent />
      </Suspense>
    </div>
  )
}

function NotesContent() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchNotes() {
      setIsLoading(true)
      setError('')
      try {
        const fetchedNotes = await getNotes()
        setNotes(fetchedNotes)
        setFilteredNotes(fetchedNotes)
      } catch (error) {
        console.error('Error fetching notes:', error)
        setError('Failed to load notes. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotes()
  }, [])

  useEffect(() => {
    const filtered = notes.filter(note =>
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedTag || selectedTag === 'All' || note.tags.includes(selectedTag))
    )
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title)
      return 0
    })
    setFilteredNotes(sorted)
  }, [notes, searchTerm, sortBy, selectedTag])

  const allTags = ['All', ...Array.from(new Set(notes.flatMap(note => note.tags)))]

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Skeleton key={index} className="h-40 w-full" />
      ))}
    </div>
  )

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <NoteFilter setSelectedTag={setSelectedTag} />
      </Suspense>

      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">All Notes</h1>
        <Button asChild>
          <Link href="/notes/create">Create New Note</Link>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3">
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            className="cursor-pointer text-md py-2 px-4 rounded-full"
            onClick={() => setSelectedTag(tag === 'All' ? null : tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      {isLoading ? (
        <SkeletonLoader />
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.$id} note={note} currentUserId={user?.$id} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No notes found. {searchTerm && 'Try a different search term or tag.'}
        </p>
      )}
    </div>
  )
}