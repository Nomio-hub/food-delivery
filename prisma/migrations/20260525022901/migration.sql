/*
  Warnings:

  - You are about to drop the column `ttl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ttl",
ADD COLUMN     "otp" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;
