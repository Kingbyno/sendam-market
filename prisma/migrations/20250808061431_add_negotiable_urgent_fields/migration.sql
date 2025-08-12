/*
  Warnings:

  - You are about to drop the column `featured` on the `items` table. All the data in the column will be lost.
  - You are about to drop the `chat_messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_itemId_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_userId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "featured",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalPrice" DOUBLE PRECISION,
ALTER COLUMN "condition" SET DEFAULT 'GOOD',
ALTER COLUMN "location" DROP NOT NULL;

-- DropTable
DROP TABLE "chat_messages";

-- DropEnum
DROP TYPE "message_sender";
