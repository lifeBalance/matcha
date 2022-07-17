<?php
// Route for home page
$app->add('/', ['GET'], 'Home');

// Routes for the API
$app->add('/api/login', ['POST', 'DELETE'], 'Logins');
