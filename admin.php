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
    <title>Admin | PMAX Preview</title>
    <?php require_once __DIR__ . '/snippets/assets.php'; ?>
</head>

<body id="admin">

    <main>
        <div id="admin-aside">
            <header>admin</header>
            <div id="notice">
                Links to each brand's dashboard are provided beside. All campaigns are password-protected, but you can access them directly from here without a password. Note: The last item on each line is the client's password, intentionally kept simple for convenient sharing.
            </div>
        </div>

        <ul id="dashboard-list">
            <li class="dashboard-item">
                <?php
                $i = 1;
                $passwords = ProductionManager::$passwords;
                foreach ($passwords as $key => $value) {
                    if ($i >= count($passwords)) break; // Prevent admin for being echoed
                    // Echo compaigns datas
                    $campaignIndex = str_pad($i, 2, '0', STR_PAD_LEFT);
                    echo  "<a href=\"/index.php?rootFolder={$value}\" target=\"_blank\">
                                <ul class=\"campaign-datas\">
                                <li class=\"data-index\">{$campaignIndex}</li>
                                <li class=\"data-brand\">{$value}</li>
                                <li class=\"data-password\">{$key}</li>
                                </ul>
                            </a>";
                    $i++;
                }
                ?>
            </li>
        </ul>
    </main>
    <button id="logout">logout</button>
</body>

</html>