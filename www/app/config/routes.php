<?php
// Route for home page
$app->add('/', ['GET'], 'Home');

// Routes for the API
$app->add('/api/tests', ['GET', 'POST', 'DELETE'], 'Test');
