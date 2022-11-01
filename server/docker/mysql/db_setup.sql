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
    `profiled` BOOLEAN NOT NULL DEFAULT 0,
    `age` INT UNSIGNED DEFAULT NULL,
    `gender` INT UNSIGNED DEFAULT 2,
    `prefers` INT UNSIGNED DEFAULT 2,
    `bio` VARCHAR(255) DEFAULT NULL,
    `location` JSON DEFAULT NULL,
    `tags` JSON DEFAULT NULL,
    `online` BOOLEAN NOT NULL DEFAULT 0,
    `last_seen` INT UNSIGNED DEFAULT NULL,
    `views` INT UNSIGNED DEFAULT 0
);

CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `to_uid` INT UNSIGNED NOT NULL,
    `from_uid` INT UNSIGNED NOT NULL,
    `type` INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS `pic_urls` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `profile_pic` BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` INT UNSIGNED,
    `token_hash` VARCHAR(64) NOT NULL,
    `expires_at` INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS `email_tokens` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `token_hash` VARCHAR(32) NOT NULL,
    `expires_at` INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS `tags` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `label` VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS `likes` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `liker` INT UNSIGNED NOT NULL,
    `liked` INT UNSIGNED NOT NULL
);

-- CREATE TABLE IF NOT EXISTS `matches` (
--     `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
--     `couple` JSON NOT NULL
-- );
CREATE TABLE IF NOT EXISTS `matches` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `liker` INT UNSIGNED NOT NULL,
    `liked` INT UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS `blocked_users` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `blocker` INT UNSIGNED NOT NULL,
    `blocked` INT UNSIGNED NOT NULL
);
