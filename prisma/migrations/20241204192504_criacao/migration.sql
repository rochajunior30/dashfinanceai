/*
  Warnings:

  - Added the required column `numeroWhatsapp` to the `APIConfiguration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "APIConfiguration" ADD COLUMN     "numeroWhatsapp" TEXT NOT NULL;
