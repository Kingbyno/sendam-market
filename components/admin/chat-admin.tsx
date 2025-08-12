"use client"

import React, { useState, useEffect, useRef, FormEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, ArrowLeft, Loader2 } from "lucide-react"
import { getAdminChatSessions, sendAdminMessage, getChatMessages } from "@/lib/actions/chat-actions"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import type { User, Item, ChatMessage as PrismaChatMessage } from "@prisma/client"

// --- Types ---
type Chat = {
  id: string
  updatedAt: Date
  item: Item
  buyer: User
  messages: PrismaChatMessage[]
}

interface SafeChatMessage {
  id: string
  content: string
  senderId: string
  createdAt: string
}

interface SafeChatSession {
  id: string
  updatedAt: string
  item: { id: string; title: string }
  buyer: { id: string; name: string | null }
  messages: SafeChatMessage[]
}

// --- Types for API results ---
type SendAdminMessageResult =
  | { success: true; message: { id: string; content?: string; message?: string; senderId?: string; userId?: string; createdAt: string | Date } }
  | { success: false; error: string }

// --- Main Component ---
export function ChatAdmin(): JSX.Element {
  const [sessions, setSessions] = useState<SafeChatSession[]>([])
  const [activeSession, setActiveSession] = useState<SafeChatSession | null>(null)
  const [messages, setMessages] = useState<SafeChatMessage[]>([])
  const [newMessage, setNewMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)
  const { toast } = useToast()
  const { user: adminUser } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // --- Fetch Sessions ---
  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true)
      const result = await getAdminChatSessions()
      if (result.success && result.sessions) {
        const safeSessions: SafeChatSession[] = result.sessions.map((session: any) => ({
          ...session,
          updatedAt: session.updatedAt instanceof Date ? session.updatedAt.toISOString() : session.updatedAt,
          messages: session.messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content ?? msg.message ?? "",
            senderId: msg.senderId ?? msg.userId ?? "",
            createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
          })),
        }))
        setSessions(safeSessions)
      } else {
        toast({ title: "Error", description: result.error || "Failed to load chat sessions.", variant: "destructive" })
      }
      setIsLoading(false)
    }
    fetchSessions()
  }, [toast])

  // --- Fetch Messages for Active Session ---
  useEffect(() => {
    if (!activeSession) return
    const fetchMessages = async () => {
      setIsLoading(true)
      const fetchedMessages = await getChatMessages(activeSession.id)
      const safeMessages: SafeChatMessage[] = (Array.isArray(fetchedMessages) ? fetchedMessages : []).map((msg: any) => ({
        id: msg.id,
        content: msg.content ?? msg.message ?? "",
        senderId: msg.senderId ?? msg.userId ?? "",
        createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
      }))
      setMessages(safeMessages)
      setIsLoading(false)
    }
    fetchMessages()
  }, [activeSession])

  // --- Scroll to Bottom on New Message ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // --- Send Message Handler ---
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeSession) return
    setIsSending(true)
    const result = await sendAdminMessage({ chatId: activeSession.id, content: newMessage })
    if (result.success && "message" in result && result.message) {
      const sentMessage = result.message
      setMessages((prev) => [
        ...prev,
        {
          id: sentMessage.id,
          content: sentMessage.message ?? newMessage,
          senderId: sentMessage.userId ?? adminUser?.id ?? "",
          createdAt: sentMessage.createdAt instanceof Date ? sentMessage.createdAt.toISOString() : sentMessage.createdAt,
        },
      ])
      setNewMessage("")
    } else if (!result.success && "error" in result) {
      toast({ title: "Error", description: result.error || "Failed to send message.", variant: "destructive" })
    }
    setIsSending(false)
  }

  // --- Helper: Get Initials ---
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // --- UI ---
  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {activeSession && (
            <Button variant="ghost" size="icon" onClick={() => setActiveSession(null)} className="md:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <MessageCircle className="h-5 w-5" />
          <span>{activeSession ? `Chat with ${activeSession.buyer.name}` : "Admin Chats"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex gap-4 overflow-hidden">
        {/* Session List */}
        <div className={cn("w-full md:w-1/3 border-r pr-4", activeSession && "hidden md:block")}>  
          <h3 className="font-semibold mb-2 px-2">Conversations</h3>
          <ScrollArea className="h-full">
            {isLoading && !sessions.length ? (
              <div className="text-center p-4">Loading chats...</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                    activeSession?.id === session.id && "bg-blue-100 dark:bg-blue-900"
                  )}
                  onClick={() => setActiveSession(session)}
                >
                  <p className="font-bold">{session.buyer.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{session.item.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {session.messages[0]?.content || "No messages yet"}
                  </p>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
        {/* Chat Area */}
        <div className={cn("flex-grow flex-col w-full md:w-2/3", !activeSession ? "hidden md:flex" : "flex")}>  
          {activeSession ? (
            <>
              <ScrollArea className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2 my-2",
                        msg.senderId === adminUser?.id ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.senderId !== adminUser?.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(activeSession.buyer.name)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "p-3 rounded-lg max-w-md",
                          msg.senderId === adminUser?.id
                            ? "bg-blue-500 text-white"
                            : "bg-white dark:bg-gray-800 border dark:border-gray-700"
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isSending}
                />
                <Button type="submit" disabled={isSending || !newMessage.trim()}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
