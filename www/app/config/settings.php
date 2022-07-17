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

// For hashing passwords (Max. 32 hex characters == 16 bytes == 128 bit).
define('SECRET_HASHING_KEY', 'BBB235ACCAC1FE7EE7328F3587FE9');

/**
 * Database settings
 */
define('DB_HOST', 'mysql');            // Name of the docker service
define('DB_DSN',  'mysql:host=' . DB_HOST);
define('DB_USER', 'root');
define('DB_PASS', '1234');
define('DB_NAME', 'matcha');
define('DB_OPTS', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

define('DB_SETUP_PHP', APPROOT . '/config/db_setup.php');
define('DB_SETUP_SQL', APPROOT . '/config/db_setup.sql');
