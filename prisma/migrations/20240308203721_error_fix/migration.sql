/*
  Warnings:

  - You are about to drop the `Error` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Error";

-- CreateTable
CREATE TABLE "DocumentedError" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "DocumentedError_pkey" PRIMARY KEY ("id")
);
