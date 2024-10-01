import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface NoteCardProps {
  note: {
    $id?: string
    title: string
    content: string
    userId?: string
    authorName?: string
    tags: string[]
  }
  currentUserId?: string | undefined
}

export default function NoteCard({ note, currentUserId }: NoteCardProps) {
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
        <div className="flex flex-wrap gap-2 mb-2">
          {note.tags.map(tag => (
            <Link
              key={tag}
              href={`/notes?tag=${tag}`}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs hover:bg-secondary/80"
            >
              {tag}
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">By {note.authorName}</p>
      </CardContent>
      {currentUserId === note.userId && (
        <CardFooter>
          <Button asChild variant="outline" size="sm">
            <Link href={`/notes/${note.$id}/edit`}>Edit</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}