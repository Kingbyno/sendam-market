-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "purchase_status" ADD VALUE 'CONFIRMED';
ALTER TYPE "purchase_status" ADD VALUE 'RELEASED';
ALTER TYPE "purchase_status" ADD VALUE 'DISPUTED';
ALTER TYPE "purchase_status" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "releasedAt" TIMESTAMP(3);
