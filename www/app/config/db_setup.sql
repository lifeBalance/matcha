CREATE DATABASE IF NOT EXISTS `matcha`;

USE `matcha`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `pwd_hash` VARCHAR(255) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT 0,
    `push_notif` BOOLEAN NOT NULL DEFAULT 1,
    `token` VARCHAR(64) UNIQUE NULL,
    `profile_pic` VARCHAR(255) NOT NULL DEFAULT ''
);

INSERT INTO
    `users` (
        `id`,
        `username`,
        `profile_pic`,
        `email`,
        `pwd_hash`,
        `confirmed`
    )
VALUES
    (
        1,
        'Bob',
        '',
        'camagru69@outlook.com',
        '$2y$10$Wt2XXhvVfFyWSkupAL0OzOv3I9b9AZvPMUpoCo7FLosiAyzsD9FiW',
        1
    ),
    (
        2,
        'Lynda',
        'https://robohash.org/44585be6e8575964e1823fab8af2d66d?set=set4&bgset=&size=200x200',
        'agrucam@hotmail.com',
        '$2y$10$Fza7OXvlIuDKsxNHtG/zuO7.BKlaZyRy.KVRpK0nA3wxhjav3LVHK',
        1
    );

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
    token_hash VARCHAR(64) NOT NULL,
    expires_at INT UNSIGNED NOT NULL,
    PRIMARY KEY(token_hash),
    INDEX(expires_at)
);