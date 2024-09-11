/*
  Warnings:

  - Made the column `filePath` on table `Folder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "filePath" SET NOT NULL;
