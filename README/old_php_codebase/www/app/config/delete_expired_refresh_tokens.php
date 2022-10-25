<?php
// Bootstrap script (necessary database connection variables)
require_once __DIR__ . '/bootstrap.php';
// Composer's autoload
require_once dirname(__DIR__) . '/vendor/autoload.php';

$cleaner = new RefreshToken();
$count = $cleaner->deleteExpired();
echo "Removed $count refresh tokens.\n";
