-- AlterEnum
ALTER TYPE "CarCategory" ADD VALUE 'SUPERCAR';
ALTER TYPE "CarCategory" ADD VALUE 'TRACK_TOY';
ALTER TYPE "CarCategory" ADD VALUE 'HOT_HATCH';
ALTER TYPE "CarCategory" ADD VALUE 'RALLY';
ALTER TYPE "CarCategory" ADD VALUE 'ELECTRIC';
ALTER TYPE "CarCategory" ADD VALUE 'DRIFT';

-- CreateTable
CREATE TABLE "UserCar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "notes" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserCar_userId_idx" ON "UserCar"("userId");

-- CreateIndex
CREATE INDEX "UserCar_carId_idx" ON "UserCar"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCar_userId_carId_key" ON "UserCar"("userId", "carId");

-- AddForeignKey
ALTER TABLE "UserCar" ADD CONSTRAINT "UserCar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCar" ADD CONSTRAINT "UserCar_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
