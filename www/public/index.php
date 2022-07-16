<?php
// Composer's autoload
require_once dirname(__DIR__) . '/app/vendor/autoload.php';

$app = new Router();
require_once dirname(__DIR__) . '/app/config/routes.php';
$app->run();

// print("<pre>".print_r($app->getRoutes(), true)."</pre>");
