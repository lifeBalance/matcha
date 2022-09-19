<?php

// API routes for authentication
$app->add('/api/login', ['POST'], 'Login');
$app->add('/api/logout', ['POST'], 'Logout'); // POST??
$app->add('/api/refresh', ['POST'], 'Refresh'); // POST??

// Other API routes
$app->add('/api/users', ['GET', 'POST', 'DELETE', 'OPTIONS'], 'Users');

// To check if a given username exists in the DB (During Signup)
$app->add('/api/usernames', ['POST'], 'Usernames');

$app->add('/api/test', ['GET'], 'Test'); // for testing apache