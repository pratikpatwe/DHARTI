"use client"

import { UserButton as ClerkUserButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserButton() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  if (!isLoaded) {
    // Show a skeleton loader while Clerk loads
    return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
  }

  return (
    <>
      <SignedIn>
        <ClerkUserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "h-10 w-10",
              userButtonTrigger:
                "focus:outline-none focus:ring-2 focus:ring-[#00008B] focus:ring-offset-2 rounded-full",
            },
          }}
        />
      </SignedIn>

      <SignedOut>
        <Button onClick={() => router.push("/sign-in")} className="bg-[#00008B] hover:bg-blue-900 text-white">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </SignedOut>
    </>
  )
}
