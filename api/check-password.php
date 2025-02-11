<?php
require_once __DIR__ . '/../assets/php/modules/production-manager.php';    

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get the entered password
    $enteredPassword = $_POST["password"] ?? '';

    // Normalize the entered password
    function normalizeString($string)
    {
        $normalized = transliterator_transliterate('Any-Latin; Latin-ASCII', $string);
        return strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $normalized)); // Convert to lowercase
    }

    $normalizedPassword = normalizeString($enteredPassword);

    session_start();

    if ($normalizedPassword === "admin") {
        // Grant admin access
        $_SESSION['isAdmin'] = true;
        header('Location: /admin.php');
        exit;
    } elseif (array_key_exists($normalizedPassword, ProductionManager::$passwords)) {
        // Set the root folder for regular users
        $_SESSION['rootFolder'] = ProductionManager::$passwords[$normalizedPassword];
        header('Location: /');
        exit;
    }

    // Invalid password
    header('Location: /login.php?error=invalid');
    exit;
}