import NoteForm from '@/components/note-form'

export default function CreateNotePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Create New Note</h1>
      <NoteForm />
    </div>
  )
}