/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identityDocument]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[whatsapp]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_identityDocument_key" ON "users"("identityDocument");

-- CreateIndex
CREATE UNIQUE INDEX "users_whatsapp_key" ON "users"("whatsapp");
