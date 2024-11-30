/*
  Warnings:

  - You are about to drop the column `metadata` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `Channel` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ChannelType" ADD VALUE 'LOCALE';
ALTER TYPE "ChannelType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "metadata",
DROP COLUMN "settings",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;
