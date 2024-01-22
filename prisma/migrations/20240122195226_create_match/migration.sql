-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `homeTeam` VARCHAR(255) NOT NULL,
    `awayTeam` VARCHAR(255) NOT NULL,
    `homeScore` INTEGER NOT NULL,
    `awayScore` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `stadium` VARCHAR(255) NOT NULL,
    `competition` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
