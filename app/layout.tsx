import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SonnerToastProvider } from "@/components/sonner-toast-provider"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata = {
  title: "DHARTI",
  description: "Official portal for Digital India services",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="google" content="notranslate" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="theme-color" content="#00008B" />
        </head>
        <body>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SonnerToastProvider>{children}</SonnerToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
