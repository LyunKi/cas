-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "mobile" TEXT,
    "emial" TEXT NOT NULL,
    "avatar" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "provider" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "createdBy" TEXT DEFAULT 'SYSTEM',
    "updatedBy" TEXT NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "users_emial_key" ON "users"("emial");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_updatedAt_idx" ON "users"("updatedAt");
