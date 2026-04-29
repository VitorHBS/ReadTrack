/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Book` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "updateAt";

-- Update status column to enum type
ALTER TABLE "Book" ALTER COLUMN "status" SET DATA TYPE "BookStatus" USING ("status"::"BookStatus");

-- Add updatedAt with current timestamp as default for existing rows
ALTER TABLE "Book" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update the column to use @updatedAt trigger behavior
ALTER TABLE "Book" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Change rating from INTEGER to DOUBLE PRECISION
ALTER TABLE "Book" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;
