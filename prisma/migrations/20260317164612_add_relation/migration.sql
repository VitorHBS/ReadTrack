/*
  Warnings:

  - Added the required column `updateAt` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('READING', 'COMPLETE', 'PLANNED');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
