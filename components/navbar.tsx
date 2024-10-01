"use client"

import Link from "next/link"
import { BookOpen, User, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { ModeToggle } from "./theme-switcher"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-foreground"
          >
            <BookOpen className="w-6 h-6" />
            <span>NoteShare</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/notes">All Notes</Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <User className="w-5 h-5" />
                    <span className="sr-only">Profile</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings">
                    <Settings className="w-5 h-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-5 h-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
            <ModeToggle />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px] bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
              <SheetHeader>
                <SheetTitle className="text-foreground">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                {user ? (
                  <>
                    <SheetClose asChild>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/notes" className="flex items-center">
                          <BookOpen className="w-5 h-5 mr-2" />
                          <span className="text-foreground">All Notes</span>
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/profile" className="flex items-center">
                          <User className="w-5 h-5 mr-2" />
                          <span className="text-foreground">Profile</span>
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/settings" className="flex items-center">
                          <Settings className="w-5 h-5 mr-2" />
                          <span className="text-foreground">Settings</span>
                        </Link>
                      </Button>
                    </SheetClose>
                    <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                      <LogOut className="w-5 h-5 mr-2" />
                      <span className="text-foreground">Logout</span>
                    </Button>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                  </SheetClose>
                )}
                <div className="pt-4">
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}