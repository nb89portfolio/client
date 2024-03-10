/*
  Warnings:

  - Changed the type of `updated` on the `Error` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Error" DROP COLUMN "updated",
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;
