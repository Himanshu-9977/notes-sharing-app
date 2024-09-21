import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface NoteCardProps {
  note: {
    $id: string
    title: string
    content: string
    userId: string
  }
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/notes/${note.$id}`} className="hover:underline">
            {note.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">{note.content.substring(0, 100)}...</p>
        <p className="text-sm text-muted-foreground">By {note.userId}</p>
      </CardContent>
    </Card>
  )
}