/*
  Warnings:

  - Added the required column `address` to the `FoodOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodOrder" ADD COLUMN     "address" TEXT NOT NULL;
