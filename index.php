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
    if (isset($_GET['rootFolder']) && isset($_SESSION['isAdmin'])) {
        $rootFolder =  $_GET['rootFolder'];
    } elseif (isset($_SESSION['isAdmin'])) {
        header("Location: /admin.php");
        exit;
    } else {
        header("Location: /login.php");
        exit;
    }
} else {
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
    <title><?php echo ucfirst($rootFolder) ?> | Banner Preview</title>
    <?php require_once __DIR__ . '/snippets/assets.php'; ?>

    <!-- json production data -->
    <script id="production-data" type="application/json">
        <?php echo $productionData; ?>
    </script>

</head>

<body id="dashboard">
    <header>

        <div id="page-label">dashboard</div>

        <div id="selectors">
            <div id="variation" class="collapsible">
                <button class="collapsible__head button-default">campaign</button>
                <div class="collapsible__body selectable" data-type="variation"><?php
                                                                                echo ElementBuilder::createOptions(PRODUCTION_DATA, $defaultVar);
                                                                                ?></div>
            </div>

            <div id="version" class="collapsible">
                <button class="collapsible__head button-default">version</button>
                <div class="collapsible__body selectable" data-type="version"> <?php
                                                                                echo ElementBuilder::createOptions(PRODUCTION_DATA[$defaultVar], $defaultVer);
                                                                                ?></div>
            </div>

            <div id="language" class="collapsible">
                <button class="collapsible__head button-default">language</button>
                <div class="collapsible__body selectable" data-type="language"><?php
                                                                                echo ElementBuilder::createOptions(PRODUCTION_DATA[$defaultVar][$defaultVer], $defaultLan);
                                                                                ?></div>
            </div>


            <div id="ratios" class="collapsible">
                <button class="collapsible__head button-default">served-size</button>
                <div class="collapsible__body">
                    <ul class="banner-filter__options" id="view-mode-switch">
                        <li class="option"><button id="multi" class="button-default">multi-view</button></li>
                        <li class="option"><button id="single" class="button-default">single-view</button></li>
                    </ul>
                    <ul class="banner-filter__options" id="banner-size-list">
                        <?php
                        $servedSizes = DEFAULT_SRC_FILE["served-sizes"];
                        echo ElementBuilder::createRadioButtons($servedSizes);
                        ?>
                    </ul>
                    <button id="toggle" class="button-default">toggle</button>
                </div>
            </div>
        </div>
    </header>
    <main>

        <div id="banner-preview-board">
            <?php
            $defaultPathToFile = DEFAULT_SRC_FILE['path-to-file'];
            echo ElementBuilder::createBanners($servedSizes, $defaultPathToFile);
            ?>
        </div>

        <?php require_once __DIR__ . '/snippets/utility-bar.php'; ?>
    </main>
</body>

</html>