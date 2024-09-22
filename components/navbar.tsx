"use client";

import Link from "next/link";
import { BookOpen, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "./theme-switcher";

// Remove or comment out unused imports
// import { Search } from "lucide-react"
// import { Input } from "./ui/input"

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <BookOpen className="w-6 h-6" />
            <span>NoteShare</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="outline">
                  <Link href="/notes">All Notes</Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <User className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings">
                    <Settings className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
            <ModeToggle />
          </div>
          <Button variant="outline" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </nav>
  );
}
