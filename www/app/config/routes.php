<?php

// API routes for authentication
$app->add('/api/login', ['POST'], 'Login');
$app->add('/api/logout', ['POST'], 'Logout'); // POST??
$app->add('/api/refresh', ['POST'], 'Refresh'); // POST??

// Other API routes
$app->add('/api/users', ['GET', 'POST', 'DELETE', 'OPTIONS'], 'Users');
$app->add('/api/profiles', ['GET', 'POST'], 'Profiles');

// Routes for Account confirmations and password resets
$app->add('/api/confirm', ['POST', 'PUT'], 'AccountConfirmations');
$app->add('/api/reset', ['POST', 'PUT'], 'PasswordResets');

// Check if a given username or email exists in the DB (During Signup)
$app->add('/api/usernames', ['POST'], 'Usernames');
$app->add('/api/emails', ['POST'], 'Emails');

$app->add('/api/test', ['GET'], 'Test'); // for testing apache