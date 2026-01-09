/*
  Warnings:

  - The values [FRIENDS,FRIENDLY,TOURNAMENT] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - The values [FIVE,SEVEN,ELEVEN,OTHER] on the enum `CourtType` will be removed. If these variants are still used in the database, this will fail.
  - The values [VERY_BAD,BAD,NEUTRAL,GOOD,VERY_GOOD] on the enum `PerformanceRating` will be removed. If these variants are still used in the database, this will fail.
  - The values [WON,LOST,TIED] on the enum `Result` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `placeId` on the `matches` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `placeName` on the `matches` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('friends', 'friendly', 'tournament');
ALTER TABLE "matches" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "Category_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CourtType_new" AS ENUM ('5', '7', '11', 'other');
ALTER TABLE "matches" ALTER COLUMN "courtType" TYPE "CourtType_new" USING ("courtType"::text::"CourtType_new");
ALTER TYPE "CourtType" RENAME TO "CourtType_old";
ALTER TYPE "CourtType_new" RENAME TO "CourtType";
DROP TYPE "CourtType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PerformanceRating_new" AS ENUM ('very_bad', 'bad', 'neutral', 'good', 'very_good');
ALTER TABLE "matches" ALTER COLUMN "performance" TYPE "PerformanceRating_new" USING ("performance"::text::"PerformanceRating_new");
ALTER TYPE "PerformanceRating" RENAME TO "PerformanceRating_old";
ALTER TYPE "PerformanceRating_new" RENAME TO "PerformanceRating";
DROP TYPE "PerformanceRating_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Result_new" AS ENUM ('won', 'lost', 'tied');
ALTER TABLE "matches" ALTER COLUMN "result" TYPE "Result_new" USING ("result"::text::"Result_new");
ALTER TYPE "Result" RENAME TO "Result_old";
ALTER TYPE "Result_new" RENAME TO "Result";
DROP TYPE "Result_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_userId_fkey";

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "address" VARCHAR(500),
ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "country" VARCHAR(100),
ALTER COLUMN "goalsFor" SET DEFAULT 0,
ALTER COLUMN "goalsAgainst" SET DEFAULT 0,
ALTER COLUMN "placeId" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "placeName" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" VARCHAR(150),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "user_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalMatches" INTEGER NOT NULL DEFAULT 0,
    "totalWins" INTEGER NOT NULL DEFAULT 0,
    "totalLosses" INTEGER NOT NULL DEFAULT 0,
    "totalTies" INTEGER NOT NULL DEFAULT 0,
    "totalGoalsFor" INTEGER NOT NULL DEFAULT 0,
    "totalGoalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "fiveMatches" INTEGER NOT NULL DEFAULT 0,
    "sevenMatches" INTEGER NOT NULL DEFAULT 0,
    "elevenMatches" INTEGER NOT NULL DEFAULT 0,
    "otherMatches" INTEGER NOT NULL DEFAULT 0,
    "lastMatchDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_stats_userId_key" ON "user_stats"("userId");

-- CreateIndex
CREATE INDEX "matches_userId_idx" ON "matches"("userId");

-- CreateIndex
CREATE INDEX "matches_date_idx" ON "matches"("date");

-- CreateIndex
CREATE INDEX "matches_courtType_idx" ON "matches"("courtType");

-- CreateIndex
CREATE INDEX "matches_category_idx" ON "matches"("category");

-- CreateIndex
CREATE INDEX "matches_result_idx" ON "matches"("result");

-- CreateIndex
CREATE INDEX "matches_performance_idx" ON "matches"("performance");

-- CreateIndex
CREATE INDEX "matches_userId_date_idx" ON "matches"("userId", "date");

-- CreateIndex
CREATE INDEX "matches_createdAt_idx" ON "matches"("createdAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
