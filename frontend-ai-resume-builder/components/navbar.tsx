"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, ChevronDown, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CreditBadge } from "@/components/credit-badge"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const userName = session?.user?.name || session?.user?.email || "User"
  const userInitial = (userName || "U")[0].toUpperCase()

  // Render a placeholder during SSR to avoid context access issues
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container-center flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">ResumePro</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container-center flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">ResumePro</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user && <CreditBadge />}
          
          {session?.user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={userName} />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </>
          )}
          
          {!session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  Get Started
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/templates" className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    Resume Builder
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ats-tools" className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    ATS Tools
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}
