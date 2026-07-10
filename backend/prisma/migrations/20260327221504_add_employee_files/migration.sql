/*
  Warnings:

  - A unique constraint covering the columns `[fileNumber]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "contract" TEXT,
ADD COLUMN     "emaratesId" TEXT,
ADD COLUMN     "fileNumber" TEXT NOT NULL,
ADD COLUMN     "nsiCert" TEXT,
ADD COLUMN     "passport" TEXT,
ADD COLUMN     "pic" TEXT,
ADD COLUMN     "psbdId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_fileNumber_key" ON "Employee"("fileNumber");
