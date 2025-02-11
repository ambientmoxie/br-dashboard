<?php
session_start();

require_once __DIR__ . '/assets/php/helpers.php';

// Checks if any $_SESSION variable is set. 
// Redirect to login.php if not.
if (isset($_SESSION['rootFolder'])) {
    header("Location: /");
    exit;
} else if (isset($_SESSION['isAdmin'])) {
    header("Location: /admin.php");
    exit;
}

// Check for error parameter after password submission.
$error = isset($_GET['error']) && $_GET['error'] === 'invalid' ? true : false;

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Login | Banner Preview</title>
    <?php require_once __DIR__ . '/snippets/assets.php'; ?>
</head>

<body id="login">

    <header>
        <div id="page-label">login</div>
        <div id="current-time">deded</div>
    </header>

    <main>
        <form action="/api/check-password.php" method="POST">
            <label for="password">Enter your password to proceed:</label>
            <div id="input-wrapper">
                <input type="password" name="password" id="password" placeholder="Password*" required>
                <button type="button" id="toggle-password" aria-label="Show password">
                    <?php require_once __DIR__ . '/snippets/eye-icon.php'; ?>
                </button>
            </div>
            <?php if ($error): ?>
                <p id="alert-password">Invalid password. Please try again.</p>
            <?php endif; ?>
            <button class="button-default" type="submit" id="submit">Submit</button>
        </form>
    </main>

    <footer id="imprint" class="fixed-footer">
        <p>
            BANNER REVIEW DASHBOARD <?php echo $_ENV['APP_VERSION'] ?> <span id="compressed-date"></span>
        </p>
        <p id="CC0">No rights reserved. CC0 (Creative Commons Zero) <br /> Typeface: Sempione Grotesk Medium</p>
    </footer>

</body>

</html>