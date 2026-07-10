/*
  Warnings:

  - You are about to drop the column `date` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `shiftId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `type` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('PERMANENT', 'RELIEVER', 'VACATION');

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_shiftId_fkey";

-- DropIndex
DROP INDEX "Assignment_employeeId_shiftId_date_key";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "date",
DROP COLUMN "shiftId",
ADD COLUMN     "contractId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "locationId" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "type" "AssignmentType" NOT NULL;

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status",
ADD COLUMN     "locationId" TEXT;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
