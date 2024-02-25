-- CreateTable
CREATE TABLE "Error" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "updated" TIMESTAMP(3)[],

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);
