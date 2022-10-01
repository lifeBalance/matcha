CREATE DATABASE IF NOT EXISTS `matcha`;

USE `matcha`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `firstname` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `pwd_hash` VARCHAR(255) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT 0
);

INSERT INTO
    `users` (
        `id`,
        `username`,
        `firstname`,
        `lastname`,
        `email`,
        `pwd_hash`,
        `confirmed`
    )
VALUES
    (
        1,
        'crazyBear',
        'Robert',
        'Johnson',
        'test@test.com',
        '$2y$10$m2E7H1mg/MJ7.4cwqIDiTe/iJ48i/yULkd/XLVSRL4RUE8qf5jkcG',
        1
    ),
    (
        2,
        'bjQueen',
        'Lynda',
        'Doe',
        'test2@test.com',
        '$2y$10$m2E7H1mg/MJ7.4cwqIDiTe/iJ48i/yULkd/XLVSRL4RUE8qf5jkcG',
        1
    );

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
    `user_id` INT UNSIGNED,
    `token_hash` VARCHAR(64) PRIMARY KEY NOT NULL,
    `expires_at` INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS `email_tokens` (
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `email_token` VARCHAR(32) NOT NULL,
    `expires_at` INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS `profiles` (
    `id` INT UNSIGNED PRIMARY KEY NOT NULL,
    `age` INT UNSIGNED DEFAULT 18,
    `gender` INT UNSIGNED DEFAULT 2,
    `prefers` INT UNSIGNED DEFAULT 2,
    `bio` VARCHAR(255) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS `checked_users` (
    `id` INT UNSIGNED PRIMARY KEY NOT NULL,
    `checked_by` INT UNSIGNED NOT NULL
);
CREATE TABLE IF NOT EXISTS `liked_users` (
    `id` INT UNSIGNED PRIMARY KEY NOT NULL,
    `likes` INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS `blocked_users` (
    `id` INT UNSIGNED PRIMARY KEY NOT NULL,
    `blocks` INT UNSIGNED NOT NULL
);

INSERT INTO
    `profiles` (
        `id`,
        `gender`,
        `age`,
        `prefers`,
        `bio`
    )
VALUES
    (
        1,
        1,
        31,
        0,
        "I like long walks in the beach with my girlfriend, until the acid wears off, and I realize I'm draggin a manequin through the parking lot."
    ),
    (
        2,
        0,
        30,
        2,
        "If you are looking for a woman with personality, well it's your lucky day, because I have multiple"
    );
