"use client"

import type React from "react"

import { Toaster as SonnerToaster } from "sonner"
import { useTheme } from "next-themes"

interface ToastProviderProps {
  children?: React.ReactNode
}

export function SonnerToastProvider({ children }: ToastProviderProps) {
  const { theme } = useTheme()

  return (
    <>
      {children}
      <SonnerToaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#1f2937" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#1f2937",
            border: "1px solid",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          },
          duration: 4000,
        }}
      />
    </>
  )
}
