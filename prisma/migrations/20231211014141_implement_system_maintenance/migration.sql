/*
  Warnings:

  - The values [viewer] on the enum `user_polices` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_polices_new" AS ENUM ('normal', 'admin', 'super');
ALTER TABLE "users" ALTER COLUMN "police" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "police" TYPE "user_polices_new" USING ("police"::text::"user_polices_new");
ALTER TYPE "user_polices" RENAME TO "user_polices_old";
ALTER TYPE "user_polices_new" RENAME TO "user_polices";
DROP TYPE "user_polices_old";
ALTER TABLE "users" ALTER COLUMN "police" SET DEFAULT 'normal';
COMMIT;

-- CreateTable
CREATE TABLE "system-maintenance" (
    "id" UUID NOT NULL,
    "startMaintenance" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endMaintenance" TIMESTAMP(3),
    "description" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "system-maintenance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "system-maintenance" ADD CONSTRAINT "system-maintenance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
