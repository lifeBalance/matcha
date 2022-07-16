<?php

require_once dirname(__DIR__) . '/app/vendor/autoload.php';

$app = new Router();
$app->add('/api/tests', ['GET', 'POST', 'DELETE'], 'Test');
$app->run();

// print("<pre>".print_r($app->getRoutes(), true)."</pre>");
