/*
  Warnings:

  - You are about to drop the `APIConfiguration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "APIConfiguration";

-- CreateTable
CREATE TABLE "apiConfiguration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "APIType" NOT NULL,
    "url" TEXT NOT NULL,
    "numeroWhatsapp" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "senha" TEXT,
    "apiId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apiConfiguration_pkey" PRIMARY KEY ("id")
);
