<?php

// Make access to .env file through php file
// by using the following synthax: $_ENV["VAR_NAME"];
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();

require_once __DIR__ . '/modules/asset-helper.php';
require_once __DIR__ . '/modules/element-builder.php';
require_once __DIR__ . '/modules/production-manager.php';
