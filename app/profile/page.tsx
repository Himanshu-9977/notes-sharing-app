'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import NoteCard from '@/components/note-card'
import { getNotes } from '@/lib/notesService'

// Define Note type if not already defined in the notes service
interface Note {
  $id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || '') // Initialize with user's name
  const [userNotes, setUserNotes] = useState<Note[]>([]) // Type userNotes as an array of Note
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Use useCallback to memoize the function and avoid infinite loops
  const fetchUserNotes = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const notes = await getNotes()
      setUserNotes(notes.filter((note: Note) => note.userId === user?.$id))
    } catch (error) {
      console.error('Error fetching user notes:', error)
      setError('Failed to load your notes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [user?.$id])

  useEffect(() => {
    if (user) {
      fetchUserNotes()
    }
  }, [fetchUserNotes, user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    setError('')
    setSuccess('')
    try {
      await updateProfile(name)
      setSuccess('Profile updated successfully!')
    } catch (error) {
      console.error('Profile update failed', error)
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Your Profile</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isUpdating}
                />
              </div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Member since:</strong> {new Date(user.$createdAt).toLocaleDateString()}</p>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : userNotes.length > 0 ? (
              <div className="space-y-4">
                {userNotes.map((note) => (
                  <NoteCard key={note.$id} note={note}  />
                ))}
              </div>
            ) : (
              <p>You haven&apos;t created any notes yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
