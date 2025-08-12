ALTER TABLE "seller_payment_info" ADD CONSTRAINT "seller_payment_info_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE CASCADE;
