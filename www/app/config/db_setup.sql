CREATE DATABASE IF NOT EXISTS `matcha`;

USE `matcha`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `firstname` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `pwd_hash` VARCHAR(255) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT 0,
    `email_token` VARCHAR(64) UNIQUE NULL
);

INSERT INTO
    `users` (
        `id`,
        `username`,
        `firstname`,
        `lastname`,
        `email`,
        `pwd_hash`,
        `confirmed`,
        `email_token`
    )
VALUES
    (
        1,
        'crazyBear',
        'Robert',
        'Johnson',
        'camagru69@outlook.com',
        '$2y$10$Wt2XXhvVfFyWSkupAL0OzOv3I9b9AZvPMUpoCo7FLosiAyzsD9FiW',
        1,
        '0c7f5439d146449aa79289969b756bf6baffb99057c316ca39d1fe64eb35f3d3'
    ),
    (
        2,
        'bjQueen',
        'Lynda',
        'Doe',
        'agrucam@hotmail.com',
        '$2y$10$Fza7OXvlIuDKsxNHtG/zuO7.BKlaZyRy.KVRpK0nA3wxhjav3LVHK',
        1,
        'e2f1d6f1fe134cc27b0d9baf51b3fd4b1210d643342de9d3cd5d408b107af94f'
    );

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
    token_hash VARCHAR(64) NOT NULL,
    expires_at INT UNSIGNED NOT NULL,
    PRIMARY KEY(token_hash),
    INDEX(expires_at)
);