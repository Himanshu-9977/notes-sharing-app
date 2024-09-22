import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/hooks/useAuth'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NoteShare - Share Your Knowledge',
  description: 'A platform for sharing and discovering notes on various topics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicony.ico" sizes="any" />
      </head>
      <body 
      suppressHydrationWarning={true}
      className={cn(inter.className, 'bg-background text-foreground')}
      >
        <AuthProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}