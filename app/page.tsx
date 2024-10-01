'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import NoteCard from '@/components/note-card'
import { getNotes } from '@/lib/notesService'

interface Note {
  $id: string;
  title: string;
  content: string;
  tags: string[];
}

export default function HomePage() {
  const { user, loading: isAuthLoading } = useAuth()
  const [recentNotes, setRecentNotes] = useState<Note[]>([]) // Define type for notes
  const [isNotesLoading, setIsNotesLoading] = useState(true)
  const [error, setError] = useState<string>('') // Define type for error as string
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [tags, setTags] = useState<string[]>([]) // Define tags as array of strings

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 3000) // Set initial loading time to 3 seconds

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    async function fetchRecentNotes() {
      if (!user) return
      setIsNotesLoading(true)
      setError('')
      try {
        const notes = await getNotes() as Note[] // Ensure the return type is `Note[]`
        setRecentNotes(notes.slice(0, 3))
        const allTags = notes.flatMap(note => note.tags)
        const uniqueTags = Array.from(new Set(allTags))
        setTags(uniqueTags)
      } catch (err) {
        console.error('Failed to fetch notes:', err)
        setError('Failed to load recent notes. Please try again later.')
      } finally {
        setIsNotesLoading(false)
      }
    }
    fetchRecentNotes()
  }, [user])

  const RecentNotesCard = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {isNotesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : recentNotes.length > 0 ? (
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <NoteCard key={note.$id} note={note} currentUserId={user?.$id} />
            ))}
          </div>
        ) : (
          <div className="text-center">No recent notes available.</div>
        )}
      </CardContent>
    </Card>
  )

  const TagsCard = () => (
    <Card>
      <CardHeader>
        <CardTitle>Popular Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/notes?tag=${tag}`}
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80"
            >
              {tag}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const SkeletonLoader = () => (
    <div className="space-y-8">
      <Skeleton className="h-12 w-3/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-full" />
              <Skeleton className="h-[60px] w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (isInitialLoading || isAuthLoading) {
    return <SkeletonLoader />
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Welcome to NoteShare</h1>
      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecentNotesCard />
          <TagsCard />
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/notes/create">Create New Note</Link>
              </Button>
              <Button variant="secondary" className="w-full">
                Join Study Group
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-lg">Join our community to share and discover notes on various topics!</p>
          <div className="flex space-x-4">
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
