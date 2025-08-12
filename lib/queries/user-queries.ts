import { prisma } from "@/lib/prisma/client"

export async function getTopSellers(limit: number = 5) {
  const sellers = await prisma.user.findMany({
    where: {
      purchasesAsSeller: {
        some: {
          status: {
            in: ["RELEASED", "COMPLETED"],
          },
        },
      },
    },
    include: {
      _count: {
        select: {
          purchasesAsSeller: {
            where: {
              status: {
                in: ["RELEASED", "COMPLETED"],
              },
            },
          },
        },
      },
    },
    orderBy: {
      purchasesAsSeller: {
        _count: "desc",
      },
    },
    take: limit,
  })

  return sellers.map((seller: any) => ({
    id: seller.id,
    name: seller.name,
    avatar: seller.avatar,
    salesCount: seller._count.purchasesAsSeller,
  }))
}
