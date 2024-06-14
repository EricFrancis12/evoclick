/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LinkToUser` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_LinkToUser" DROP CONSTRAINT "_LinkToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LinkToUser" DROP CONSTRAINT "_LinkToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "Link";

-- DropTable
DROP TABLE "_LinkToUser";

-- CreateTable
CREATE TABLE "AffiliateNetwork" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "defaultNewOfferString" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateNetwork_pkey" PRIMARY KEY ("id")
);
