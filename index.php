<?php

require_once __DIR__ . '/assets/php/helpers.php';

// Configure session for 30-day persistence
session_set_cookie_params([
    'lifetime' => 30 * 24 * 60 * 60,
    'path' => '/',
    'domain' => '',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict',
]);

session_start();

$rootFolder = "";

// Check if the root folder is set in the session. If not, check if any URL parameter is set.
// If no URL parameter is set, we can't assign any value to $rootFolder, so the user is redirected to login.php.
if (!isset($_SESSION['rootFolder'])) {
    if (isset($_GET['rootFolder'])) {
        // Replace potential spaces by "-" before assigning it
        $rootFolder =  $_GET['rootFolder'];
    } elseif (isset($_SESSION['isAdmin'])) {
        header("Location: /admin.php");
        exit;
    } else {
        header("Location: /login.php");
        exit;
    }
} else {
    // Replace potential spaces by "-" before assigning it
    $rootFolder = $_SESSION['rootFolder'];
}

// Set the path to the production directory.
$productionDirectory = __DIR__ . "/production/" . $rootFolder;

// The "PRODUCTION_DATA" constant is a snapshot of the current state of our project.
// It will be used to generate and create the appropriate UI components.
define('PRODUCTION_DATA', ProductionManager::parseDirectory($productionDirectory));

// The constant is now encoded into a JSON object to be fetched
// and used by our javascript to update the UI based on user choices.
$productionData = json_encode(PRODUCTION_DATA);

// Defining the project we want to target and display by default.
// Note that the boolean argument set is to the last item if set to "false", and to the first if set to "true"
$defaultVar = ProductionManager::getBoundaryKey(PRODUCTION_DATA, true);
$defaultVer = ProductionManager::getBoundaryKey(PRODUCTION_DATA[$defaultVar], false);
$defaultLan = ProductionManager::getBoundaryKey(PRODUCTION_DATA[$defaultVar][$defaultVer], true);
define('DEFAULT_SRC_FILE', PRODUCTION_DATA[$defaultVar][$defaultVer][$defaultLan]);

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title><?php echo ucfirst($rootFolder) ?> | PMAX Preview</title>
    <?php require_once __DIR__ . '/snippets/assets.php'; ?>

    <!-- json production data -->
    <script id="production-data" type="application/json">
        <?php echo $productionData; ?>
    </script>

</head>

<body id="dashboard">
    <main>
        <div id="sidebar">
            <div>
                <header>
                    dashboard
                </header>
                <p>Track the banner production progress by selecting a campaign, version, and language below. To examine banners closely, select ratios from the list below.</p>
            </div>

            <div id="selectors">

                <div class="selector-wrapper">
                    <div class="selector-label">
                        Select a campaign:
                    </div>
                    <select id="variation-select" data-type="variation" class="custom-select">
                        <?php
                        $variations =  PRODUCTION_DATA;
                        echo ElementBuilder::createOptions(PRODUCTION_DATA, $defaultVar);
                        ?>
                    </select>
                </div>

                <div class="selector-wrapper">
                    <div class="selector-label">
                        Select a version:
                    </div>
                    <select id="variation-select" data-type="version" class="custom-select">
                        <?php
                        $variations =  PRODUCTION_DATA;
                        echo ElementBuilder::createOptions(PRODUCTION_DATA[$defaultVar], $defaultVer);
                        ?>
                    </select>
                </div>

                <div class="selector-wrapper">
                    <div class="selector-label">
                        Select a language:
                    </div>
                    <select id="variation-select" data-type="language" class="custom-select">
                        <?php
                        $variations =  PRODUCTION_DATA;
                        echo ElementBuilder::createOptions(PRODUCTION_DATA[$defaultVar][$defaultVer], $defaultLan);
                        ?>
                    </select>
                </div>


            </div>

            <div id="banner-filter" id="served-size">
                <div id="banner-filter__label"> Select banners to review: </div>
                <div>
                    <ul class="banner-filter__options" id="view-mode-switch">
                        <li class="option" id="multi"><button class="btn-mode">multi-view</button></li>
                        <li class="option" id="single"><button class="btn-mode">single-view</button></li>
                    </ul>
                    

                    <p id="view-mode-notice">Allows you to see all the banner ratios at once and selectively enable/disable ratios.</p>

                    <ul class="banner-filter__options" id="banner-size-list">
                        <?php
                        $servedSizes = DEFAULT_SRC_FILE["served-sizes"];
                        echo ElementBuilder::createRadioButtons($servedSizes);
                        ?>
                    </ul>
                    <button id="clear-button" class="btn-mode">clear all</button>
                </div>
            </div>
        </div>
        <div id="banner-preview-board">
            <?php
            $defaultPathToFile = DEFAULT_SRC_FILE['path-to-file'];
            echo ElementBuilder::createBanners($servedSizes, $defaultPathToFile);
            ?>
        </div>
        <button id="btn-logout">log out</button>
    </main>
</body>

</html>