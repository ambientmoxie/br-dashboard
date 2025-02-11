<?php

session_start();

// Check if the user is logged in and has the correct role
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    // Redirect to login page if not authorized
    header("Location: /login.php?error=unauthorized");
    exit;
}

require_once __DIR__ . '/assets/php/helpers.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Admin | Banner Preview</title>
    <?php require_once __DIR__ . '/snippets/assets.php'; ?>
</head>

<body id="admin">

    <header id="header-admin">
        <div id="page-label">admin</div>
        <div id="current-time">deded</div>
    </header>

    <ul id="campaigns-list">
        <li id="campaign-head">
            <span>index</span>
            <span>brand</span>
            <span>quantity</span>
            <span>password</span>
            <span>access</span>
        </li>

        <?php
        
        function pluralize($count, $label)
        {
            $text = intval($count) <= 1 ? $label : $label . "s";
            return $count . " " . $text;
        }

        $i = 1;
        $passwords = ProductionManager::$passwords;
        foreach ($passwords as $key => $value) {
            
            $campaignIndex = str_pad($i, 3, '0', STR_PAD_LEFT);
            $productionFolder = __DIR__ . "/production/" . $value;
            $accountFolder = ProductionManager::parseDirectory($productionFolder);
            $campaignCount = pluralize(count($accountFolder), "campaign");

            echo  "
                <li class=\"campaign-data\">
                    <span class=\"campaign-index\">$campaignIndex</span>
                    <span class=\"campaign-name\">{$value}</span>
                    <span class=\"campaign-quantity\">{$campaignCount} produced</span>
                    <span class=\"campaign-password\">{$key}</span>
                    <span class=\"campaign-access\"> <a href=\"/index.php?rootFolder={$value}\" target=\"_blank\">go to dashboard</a></span>
                </li>
                ";
            $i++;
        }

        ?>
    </ul>
    
    <?php require_once __DIR__ . '/snippets/utility-bar.php'; ?>
</body>

</html>