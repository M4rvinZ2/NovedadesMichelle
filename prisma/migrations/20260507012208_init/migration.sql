/*
  Warnings:

  - You are about to drop the `CorteCaja` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `corteCajaId` on the `Venta` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CorteCaja";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Venta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Venta" ("createdAt", "id", "total") SELECT "createdAt", "id", "total" FROM "Venta";
DROP TABLE "Venta";
ALTER TABLE "new_Venta" RENAME TO "Venta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
