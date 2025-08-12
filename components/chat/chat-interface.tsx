"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Paperclip, Send, ArrowLeft, Users, ShieldCheck } from "lucide-react"
import { getChatMessages, sendMessage } from "@/lib/actions/chat-actions"
import type { User, Item, ChatMessage } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface ChatInterfaceProps {
  chatId: string
  item: Pick<Item, "id" | "title" | "price" | "images">
  currentUser: User
  otherParticipant?: Pick<User, "id" | "name" | "avatar">
  isAdmin: boolean
}

export function ChatInterface({ chatId, item, currentUser, otherParticipant, isAdmin }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      const initialMessages = await getChatMessages(chatId)
      setMessages(initialMessages)
      setIsLoading(false)
    }
    fetchMessages()

    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchMessages, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [chatId])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent, presetMessage?: string) => {
    e.preventDefault()
    const content = presetMessage || newMessage
    if (!content.trim()) return

    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: isAdmin ? "ADMIN" : "BUYER",
      message: content,
      createdAt: new Date(),
      itemId: item.id,
      userId: currentUser.id,
      user: {
        id: currentUser.id,
        name: currentUser.name || null,
        avatar: currentUser.avatar || null,
      },
    }

    setMessages((prev) => [...prev, optimisticMessage])
    if (!presetMessage) {
      setNewMessage("")
    }

    try {
      await sendMessage({ chatId, content })
    } catch (error) {
      console.error("Failed to send message:", error)
      toast.error("Failed to send message.")
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id))
    }
  }

  const handleProceedToPayment = () => {
    // Redirect to a payment page, passing item info and fee
    const fee = item.price * 0.15
    const total = item.price + fee
    router.push(
      `/payment/checkout?itemId=${item.id}&amount=${total}&description=${encodeURIComponent(
        `Payment for ${item.title} with Sendam verification`,
      )}`,
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-4">
      <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-lg shadow-md border">
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <Link href="/marketplace">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={otherParticipant?.avatar || undefined} alt={otherParticipant?.name || "User"} />
            <AvatarFallback>{otherParticipant?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{otherParticipant?.name}</p>
            <p className="text-sm text-gray-500 truncate">
              Regarding: <span className="font-medium text-gray-700">{item.title}</span>
            </p>
          </div>
          <Link href={`/item/${item.id}`}>
            <Image
              src={item.images?.[0] || "/placeholder.svg"}
              alt={item.title}
              width={50}
              height={50}
              className="object-cover rounded-md"
            />
          </Link>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {isLoading && messages.length === 0 ? (
              <p className="text-center text-gray-500">Loading messages...</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    msg.userId === currentUser.id ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.userId !== currentUser.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={otherParticipant?.avatar || undefined} />
                      <AvatarFallback>{otherParticipant?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                      msg.userId === currentUser.id
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.userId === currentUser.id ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Input Form */}
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
      {/* Admin Panel */}
      {isAdmin && (
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Admin Purchase Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Guide the buyer through the purchase process using the options below.
              </p>
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Users className="mr-2 h-5 w-5" />
                    Direct Meeting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Buyer meets the seller directly. No service fee is applied.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) =>
                      handleSendMessage(
                        e,
                        "Let's proceed with a direct meeting. I will connect you with the seller to arrange the details.",
                      )
                    }
                  >
                    Send Meeting Instructions
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-base text-blue-800">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Sendam Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">
                    We verify the item and handle the delivery. A 10% service fee applies.
                  </p>
                  <p className="font-bold text-lg mb-4">
                    Total: ₦{(item.price * 1.10).toLocaleString()}
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleProceedToPayment}>
                    Proceed to Payment
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
