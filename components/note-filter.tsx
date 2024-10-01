'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function NoteFilter({ setSelectedTag }: { setSelectedTag: (tag: string | null) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const tag = searchParams.get('tag')
    if (tag) {
      setSelectedTag(tag)
    }
  }, [searchParams, setSelectedTag])

  return null // This component doesn't render anything
}