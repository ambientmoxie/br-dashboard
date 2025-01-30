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
    <title>Login | PMAX Preview</title>
    <?php require_once __DIR__ . '/snippets/assets.php'; ?>
</head>

<body id="login">

    <header id="header-login">
        login
    </header>
    <main>

        <form action="/api/check-password.php" method="POST">
            <label for="password">Enter your password to proceed:</label>
            <input type="password" name="password" id="password" placeholder="Password*" required>
            <div id="form-footer">
                <a id="forget-password-link" href="mailto:aurelie.morin@tastee.studio">Forgot your password ?</a>
                <button type="submit" id="submit" class="btn-common">Submit</button>
            </div>
        </form>
        <?php if ($error): ?>
            <p id="alert-password">Invalid password. Please try again.</p>
        <?php endif; ?>

    </main>

</body>

</html>