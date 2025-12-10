-- AlterTable
ALTER TABLE "StartedProject" ADD COLUMN     "completedSteps" TEXT[] DEFAULT ARRAY[]::TEXT[];
