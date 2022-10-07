CREATE DATABASE IF NOT EXISTS matcha;

USE matcha;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `firstname` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `pwd_hash` VARCHAR(255) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT 0,
    `age` INT UNSIGNED DEFAULT NULL,
    `gender` INT UNSIGNED DEFAULT 2,
    `prefers` INT UNSIGNED DEFAULT 2,
    `bio` VARCHAR(255) DEFAULT '',
    `profile_pic` VARCHAR(255) DEFAULT ''
);

-- CREATE TABLE IF NOT EXISTS `users` (
--     `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
--     `username` VARCHAR(50) NOT NULL,
--     `firstname` VARCHAR(50) NOT NULL,
--     `lastname` VARCHAR(50) NOT NULL,
--     `email` VARCHAR(255) UNIQUE NOT NULL,
--     `pwd_hash` VARCHAR(255) NOT NULL,
--     `confirmed` BOOLEAN NOT NULL DEFAULT 0
-- );

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
    `user_id` INT UNSIGNED,
    `token_hash` VARCHAR(64) PRIMARY KEY NOT NULL,
    `expires_at` INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS `email_tokens` (
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `token_hash` VARCHAR(32) NOT NULL,
    `expires_at` INT UNSIGNED NOT NULL
);

-- CREATE TABLE IF NOT EXISTS `profiles` (
--     `id` INT UNSIGNED PRIMARY KEY NOT NULL,
--     `age` INT UNSIGNED DEFAULT 18,
--     `gender` INT UNSIGNED DEFAULT 2,
--     `prefers` INT UNSIGNED DEFAULT 2,
--     `bio` VARCHAR(255) DEFAULT '',
--     `profile_pic` VARCHAR(255) DEFAULT ''
-- );

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
