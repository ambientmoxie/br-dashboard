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

    <header id="header-admin">
        admin
    </header>

    <main>

        <p id="admin-notice">Links to each brand's dashboard are provided below. All campaigns are password-protected, but you can access them directly from here without a password. Note: The last item on each line is the client's password, intentionally kept simple for convenient sharing.</p>
        <ul id="campaigns-list">
            <?php
            function infoText($count, $label)
            {
                $text = intval($count) <= 1 ? $label : $label . "s";
                return $count . " " . $text;
            }

            $i = 1;
            $passwords = ProductionManager::$passwords;

            error_log(count($passwords));

            foreach ($passwords as $key => $value) {
                if ($i > count($passwords)) break; // Prevent admin for being echoed
                // Echo compaigns datas
                $campaignIndex = str_pad($i, 3, '0', STR_PAD_LEFT);


                $productionFolder = __DIR__ . "/production/" . $value;
                $accountFolder = ProductionManager::parseDirectory($productionFolder);
                $campaignCount = infoText(count($accountFolder), "campaign");


                echo  "
                        <li class=\"campaign\">
                            <a href=\"/index.php?rootFolder={$value}\" target=\"_blank\">
                                <div class=\"campaign-header\">
                                    <p class=\"item-header__index\">$campaignIndex</p>
                                    <p class=\"item-header__account\">{$value}</p>
                                </div>
                                <div class=\"campaign-body\">
                                    <p class=\"item-body__campaign-count\"> <span class=\"count\">{$campaignCount}</span> have been produced for this account.</p>
                                    <p class=\"item-body__campaign-password\">Password: <span>{$key}</span></p>
                                </div>
                            </a>
                        </li>
                        ";
                $i++;
            }
            ?>

        </ul>
    </main>
    <button id="btn-logout">log out</button>
</body>

</html>