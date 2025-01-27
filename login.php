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

    <main>
        <header>login</header>

        <form action="/api/check-password.php" method="POST">
            <label for="password">enter your password to proceed</label>
            <div>
                <input type="password" name="password" id="password" placeholder="Password*" required>
                <button type="submit" id="submit">submit</button>
            </div>
            <?php if ($error): ?>
                <p style="color: red;">Invalid password. Please try again.</p>
            <?php endif; ?>
        </form>

        <div id="studio-info">
            <p>placeholder.studio<br />
                19 Rue Charles,<br />
                75011 London <br />
                © <span id="current-year"></span></p>

            <div id="current-time"></div>
        </div>

        <footer>
            <div id="pm-contact">
                <ul class="pm-info">
                    <li class="pm-name">james whitmore</li>
                    <li class="pm-title">senior project manager</li>
                    <li class="pm-email"><a href="mailto:james.whitemore@placeholder.studio">james.whitmore@placeholder.studio</a></li>
                </ul>

                <ul class="pm-info">
                    <li class="pm-name">emma harrington</li>
                    <li class="pm-title">social media project manager</li>
                    <li class="pm-email"><a href="mailto:emma.harrington@placeholder.studio">emma.harrington@placeholder.studio</a></li>
                </ul>
            </div>

            <div id="credential">
                <p>Graphic design and development by <a href="mailto:contact@maximebenoit.work">Maxime Benoit</a> <br />
                    Made with taste by <a href="https://placeholder.studio/"></a>placeholder.studio</p>
            </div>
        </footer>

    </main>

</body>

</html>