-- CreateEnum
CREATE TYPE "language" AS ENUM ('EN_US', 'PT_BR');

-- CreateEnum
CREATE TYPE "user_polices" AS ENUM ('normal', 'viewer', 'admin', 'super');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageUri" TEXT,
    "identityDocument" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "language" "language" NOT NULL DEFAULT 'PT_BR',
    "police" "user_polices" NOT NULL DEFAULT 'normal',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
