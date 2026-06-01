/*
  Warnings:

  - The values [completed,challenging] on the enum `user_mission_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `user_mission` MODIFY `status` ENUM('COMPLETED', 'uncompleted', 'CHALLENGING') NOT NULL DEFAULT 'uncompleted';
