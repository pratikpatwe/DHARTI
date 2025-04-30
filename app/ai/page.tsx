"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Search, ShieldCheck, FileText, Database, Home } from "lucide-react"
import { sendMessage } from "@/app/ai/actions"
import ReactMarkdown from "react-markdown"
import SearchLayout from "@/components/layout/search-layout"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to DHARTI Property Search Assistant! I can help you find information about properties across India. You can ask about property details by owner name, location, property ID, or other criteria. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get response from AI
      const response = await sendMessage(input)

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting response:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to format the message content with markdown support
  const renderMessageContent = (content: string) => {
    return (

      <div className="whitespace-pre-wrap">

        <ReactMarkdown
          components={{
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }} {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => <thead style={{ backgroundColor: '#1e3a8a', color: 'white' }} {...props} />,
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr: ({ node, index, ...props }) => (
              <tr
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index && index % 2 === 1 ? '#f9fafb' : 'transparent'
                }}
                {...props}
              />
            ),
            th: ({ node, ...props }) => <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontWeight: '600' }} {...props} />,
            td: ({ node, ...props }) => <td style={{ padding: '0.5rem 1rem' }} {...props} />,
            p: ({ node, ...props }) => <p style={{ marginBottom: '0.5rem' }} {...props} />,
            h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }} {...props} />,
            h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }} {...props} />,
            h3: ({ node, ...props }) => <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem' }} {...props} />,
            ul: ({ node, ...props }) => <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginBottom: '0.5rem' }} {...props} />,
            ol: ({ node, ...props }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '1.25rem', marginBottom: '0.5rem' }} {...props} />,
            li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">

      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl md:text-2xl font-bold text-indigo-900">DHARTI AI</h1>
          </div>
        </div>
      </nav>

      {/* Chat container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start gap-3 max-w-[90%] md:max-w-[80%]`}>
                  {message.role === "assistant" && (
                    <Avatar className="mt-0.5 shrink-0">
                      <AvatarFallback className="bg-indigo-900 text-white">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 ${message.role === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                      }`}
                  >
                    {message.role === "assistant" ? (
                      renderMessageContent(message.content)
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="mt-0.5 shrink-0">
                      <AvatarFallback className="bg-gray-600 text-white">U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <Avatar className="mt-0.5">
                    <AvatarFallback className="bg-indigo-900 text-white">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-3 bg-white border border-gray-200 shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-900" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Features section */}
        <div className="bg-gray-100 border-t border-gray-200 py-4 hidden md:block">
          <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4 px-4">
            <div className="flex flex-col items-center justify-center text-indigo-900">
              <ShieldCheck className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium text-center">Secure Access</span>
            </div>
            <div className="flex flex-col items-center justify-center text-indigo-900">
              <Database className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium text-center">Verified Data</span>
            </div>
            <div className="flex flex-col items-center justify-center text-indigo-900">
              <FileText className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium text-center">Public Records</span>
            </div>
            <div className="flex flex-col items-center justify-center text-indigo-900">
              <Home className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium text-center">Property Details</span>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="border-t bg-white p-3 md:p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for properties (e.g., 'Find properties in Mumbai' or 'Show property ID DLR-2024-0932')"
              disabled={isLoading}
              className="flex-1 border-gray-300 focus:ring-indigo-900 focus:border-indigo-900"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-indigo-900 hover:bg-indigo-800 text-white"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-1 hidden md:inline">Search</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}