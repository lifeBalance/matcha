<?php
// declare(strict_types = 1);  // Enable strict types (Not just hinting)
// ini_set('display_errors', 'On');

// App bootstrapping (The APPROOT global is not defined yet!)
require_once dirname(dirname(__DIR__)) . '/app/config/bootstrap.php';

// Composer's autoload
require_once APPROOT . '/vendor/autoload.php';

$app = new Router();
require_once APPROOT . '/config/routes.php';

$app->run();

// print("<pre>".print_r($app->getRoutes(), true)."</pre>");
