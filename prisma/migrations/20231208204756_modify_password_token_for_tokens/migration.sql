/*
  Warnings:

  - You are about to drop the `password_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "token_type" AS ENUM ('email', 'password');

-- DropForeignKey
ALTER TABLE "password_tokens" DROP CONSTRAINT "password_tokens_userId_fkey";

-- DropTable
DROP TABLE "password_tokens";

-- CreateTable
CREATE TABLE "tokens" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "type" "token_type" NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
