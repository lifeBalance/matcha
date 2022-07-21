<?php
// Route for home page
$app->add('/', ['GET'], 'Home');

// Routes for authentication, refresh authorization
$app->add('/login', ['POST'], 'Login');
$app->add('/refresh', ['POST'], 'Refresh');

// Routes for the API
$app->add('/api/users', ['GET', 'POST', 'DELETE'], 'Users');
