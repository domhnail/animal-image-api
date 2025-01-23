/*
  Warnings:

  - You are about to drop the column `filename` on the `Image` table. All the data in the column will be lost.
  - Made the column `animal` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genre` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_size` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tags` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "animal" TEXT NOT NULL,
    "image_size" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Image" ("animal", "createdAt", "description", "genre", "id", "image_size", "tags") SELECT "animal", "createdAt", "description", "genre", "id", "image_size", "tags" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
