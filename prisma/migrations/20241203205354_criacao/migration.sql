/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "APIType" AS ENUM ('API_OFICIAL', 'API_EVOLUTION', 'N8N');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "APIConfiguration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "APIType" NOT NULL,
    "url" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "senha" TEXT,
    "apiId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "APIConfiguration_pkey" PRIMARY KEY ("id")
);
