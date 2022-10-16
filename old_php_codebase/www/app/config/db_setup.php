<?php

function db_setup()
{
    try {
        $dbh = new PDO( DB_DSN,
                        DB_USER,
                        DB_PASS,
                        DB_OPTS);
        $dbh->exec(file_get_contents(DB_SETUP_SQL));
    } catch(PDOException $e){
        die ($e->getMessage());
    }
    return $dbh;
}
