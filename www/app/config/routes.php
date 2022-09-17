<?php

// API routes for authentication
$app->add('/api/login', ['POST'], 'Login');
$app->add('/api/logout', ['POST'], 'Logout'); // POST??
$app->add('/api/refresh', ['POST'], 'Refresh'); // POST??

// Other API routes
$app->add('/api/users', ['GET', 'POST', 'DELETE', 'OPTIONS'], 'Users');

$app->add('/api/test', ['GET'], 'Test'); // for testing apache