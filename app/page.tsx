'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import NoteCard from '@/components/note-card'
import { getNotes } from '@/lib/notesService'

export default function HomePage() {
  const { user } = useAuth()
  const [recentNotes, setRecentNotes] = useState([])

  useEffect(() => {
    async function fetchRecentNotes() {
      const notes = await getNotes()
      setRecentNotes(notes.slice(0, 3) as any)
    }
    fetchRecentNotes()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Welcome to NoteShare</h1>
      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <NoteCard key={note.$id} note={note} />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Science', 'Literature', 'History', 'Programming', 'Art'].map((category) => (
                  <Link
                    key={category}
                    href={`/notes?category=${category.toLowerCase()}`}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
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