import { getAuth } from "@/lib/auth/get-auth"
import { prisma } from "@/lib/prisma/client"
import { notFound, redirect } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"

interface ChatPageProps {
  params: {
    chatId: string
  }
}

// Explicit types for chat, item, participant
interface Participant {
  id: string
  name: string
  avatar: string | null
}

interface Item {
  id: string
  title: string
  price: number
  images: string[]
}

interface Chat {
  id: string
  item: Item
  participants: Participant[]
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { user } = await getAuth()
  if (!user) {
    redirect(`/auth/login?redirect=/chat/${params.chatId}`)
  }

  // Parse chatId to extract itemId and check if user is involved
  // Assuming chatId format is "itemId-buyerId" or similar
  const [itemId, otherUserId] = params.chatId.split('-')
  
  if (!itemId) {
    notFound()
  }

  // Get the item first
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  })

  if (!item) {
    notFound()
  }

  // Check if user is either the buyer or seller
  const isSeller = user.id === item.sellerId
  const isBuyer = user.id === otherUserId || otherUserId === user.id

  if (!isSeller && !isBuyer) {
    notFound()
  }

  // Get chat messages for this item involving this user
  const messages = await prisma.chatMessage.findMany({
    where: {
      itemId: itemId,
      OR: [
        { userId: user.id },
        { item: { sellerId: user.id } },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  // Create participants list
  const participants: Participant[] = [
    {
      id: item.seller.id,
      name: item.seller.name || 'Seller',
      avatar: item.seller.avatar,
    },
  ]

  // Add buyer if they've sent messages
  const buyerMessages = messages.filter(m => m.userId !== item.sellerId)
  if (buyerMessages.length > 0) {
    const buyer = buyerMessages[0].user
    if (!participants.find(p => p.id === buyer.id)) {
      participants.push({
        id: buyer.id,
        name: buyer.name || 'Buyer',
        avatar: buyer.avatar,
      })
    }
  }

  // Construct chat object
  const chat: Chat = {
    id: params.chatId,
    item: {
      id: item.id,
      title: item.title,
      price: item.price,
      images: item.images,
    },
    participants,
  }

  const otherParticipant: Participant | undefined = participants.find((p: Participant) => p.id !== user.id)

  // Type narrowing for admin check
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean)
  const isAdmin: boolean = !!user.email && adminEmails.includes(user.email)

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
      <ChatInterface
        chatId={chat.id}
        item={chat.item}
        currentUser={user}
        otherParticipant={otherParticipant}
        isAdmin={isAdmin}
      />
    </div>
  )
}
