-- CreateEnum
CREATE TYPE "CourtType" AS ENUM ('FIVE', 'SEVEN', 'ELEVEN', 'OTHER');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FRIENDS', 'FRIENDLY', 'TOURNAMENT');

-- CreateEnum
CREATE TYPE "Result" AS ENUM ('WON', 'LOST', 'TIED');

-- CreateEnum
CREATE TYPE "PerformanceRating" AS ENUM ('VERY_BAD', 'BAD', 'NEUTRAL', 'GOOD', 'VERY_GOOD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "courtType" "CourtType" NOT NULL,
    "category" "Category" NOT NULL,
    "result" "Result" NOT NULL,
    "goalsFor" INTEGER NOT NULL,
    "goalsAgainst" INTEGER NOT NULL,
    "performance" "PerformanceRating" NOT NULL,
    "notes" TEXT,
    "placeId" TEXT NOT NULL,
    "placeName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
