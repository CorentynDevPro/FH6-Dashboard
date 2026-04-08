-- CreateEnum
CREATE TYPE "CarRarity" AS ENUM ('COMMON', 'RARE', 'ULTRA_RARE', 'EPIC', 'LEGENDARY');

-- AlterTable: add isForzaEdition column
ALTER TABLE "Car" ADD COLUMN "isForzaEdition" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: migrate rarity from Int to CarRarity enum
-- Step 1: add new enum column (nullable temporarily)
ALTER TABLE "Car" ADD COLUMN "rarityNew" "CarRarity";

-- Step 2: map old integer values to new enum labels
UPDATE "Car" SET "rarityNew" =
  CASE
    WHEN rarity = 1 THEN 'COMMON'::"CarRarity"
    WHEN rarity = 2 THEN 'RARE'::"CarRarity"
    WHEN rarity = 3 THEN 'ULTRA_RARE'::"CarRarity"
    WHEN rarity = 4 THEN 'EPIC'::"CarRarity"
    WHEN rarity = 5 THEN 'LEGENDARY'::"CarRarity"
    ELSE 'COMMON'::"CarRarity"
  END;

-- Step 3: make the new column NOT NULL with default
ALTER TABLE "Car" ALTER COLUMN "rarityNew" SET NOT NULL;
ALTER TABLE "Car" ALTER COLUMN "rarityNew" SET DEFAULT 'COMMON'::"CarRarity";

-- Step 4: drop old integer column and rename new column
ALTER TABLE "Car" DROP COLUMN "rarity";
ALTER TABLE "Car" RENAME COLUMN "rarityNew" TO "rarity";
