<?php
/**
 * This file contains GLOBALS that can be accessed 
 * in other files by key, e.g. GLOBAL['DB_HOST']
 */

/**
 * General settings
 */
define('SITENAME', 'matcha');
define('VERSION', '1.0.0');
define('URLROOT', 'http://localhost');

// Some useful folders
define('APPROOT', dirname(__DIR__));
define('PUBLIC_DIR', $_SERVER['DOCUMENT_ROOT']);
define('UPLOADS_DIR', PUBLIC_DIR . '/uploads');

// For hashing email tokens (128 bit = 16 bytes =  32 hex characters (max.)
define('EMAIL_TOKENS_KEY', 'BBB235ACCAC1FE7EE7328F3587FE9');

// For hashing JWT signatures (256 bit).
define('SECRET_JWT_KEY', '217A25432A462D4A614E645267556B58703273357538782F413F4428472B4B62');

// Expiry dates of tokens
define('REFRESH_TOKEN_EXP',  60 * 60 * 5);  // 5 HOURS
define('ACCESS_TOKEN_EXP',  60 * 60);    // 60 Mins
// define('ACCESS_TOKEN_EXP',  60 * 15);    // 15 Mins
// define('ACCESS_TOKEN_EXP',  60 * 1);     //  1 Min
// define('ACCESS_TOKEN_EXP',  20);            // 20 Seconds
define('EMAIL_TOKEN_EXP',  60 * 60 * 24);   // 24 Hours

/**
 * Database settings
 */
define('DB_HOST', 'mysql');            // Name of the docker service
define('DB_DSN',  'mysql:host=' . DB_HOST);
define('DB_USER', 'root');
define('DB_PASS', '1234');
define('DB_NAME', 'matcha');
define('DB_OPTS', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);

define('DB_SETUP_PHP', APPROOT . '/config/db_setup.php');
define('DB_SETUP_SQL', APPROOT . '/config/db_setup.sql');

// Define the MAILPWD global variable with the value of MAILPWD env. var.
define('MAIL_FROM', $_ENV['MAIL_FROM']);
define('MAIL_PWD', $_ENV['MAIL_PWD']);
