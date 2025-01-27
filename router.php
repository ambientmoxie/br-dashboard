<?php

// This application uses PHP's built-in server with router.php to handle static files correctly.
// Without router.php, requests for static files can cause redirection loops between index.php and login.php.
// Check if the requested file exists; if not, route to index.php.

if (file_exists(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))) {
    return false; 
}

require_once __DIR__ . '/index.php';
