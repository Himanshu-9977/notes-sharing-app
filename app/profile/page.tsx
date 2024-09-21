'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import NoteCard from '@/components/note-card'
import { getNotes } from '@/lib/notesService'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState('')
  const [userNotes, setUserNotes] = useState([])

  useEffect(() => {
    if (user) {
      setName(user.name)
      fetchUserNotes()
    }
  }, [user])

  const fetchUserNotes = async () => {
    if (user) {
      const notes = await getNotes()
      setUserNotes(notes.filter(note => note.userId === user.$id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(name)
    } catch (error) {
      console.error('Profile update failed', error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Your Profile</h1>
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
                />
              </div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Member since:</strong> {new Date(user.$createdAt).toLocaleDateString()}</p>
              <Button type="submit">Update Profile</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userNotes.map((note) => (
                <NoteCard key={note.$id} note={note} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}