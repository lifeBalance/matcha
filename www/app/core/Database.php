<?php

// Include the script that contains the setup_db() function
require_once DB_SETUP_PHP;

class Database
{
    static $conn;

    static function connect()
    {
        if (self::$conn === null)
        {
            try {
                // Connect to existing database
                $dsn  = 'mysql:host='. DB_HOST;
                $dsn .= ';dbname='   . DB_NAME;
                self::$conn = new PDO(  $dsn,
                                        DB_USER,
                                        DB_PASS,
                                        DB_OPTS);
            } catch(PDOException $e){
                if ($e->getCode() == 1049)  // Code 1049: DB does not exist.
                    $dbh = setup_db();      // Run script to set up database
            }
        }
        return self::$conn;
    }
}