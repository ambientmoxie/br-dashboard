<?php if ($_ENV['VITE_DEV'] === "true"): ?>
    <!-- Include Vite dev server for HMR -->
    <script type="module" src="http://<?= $_ENV['VITE_DEV_SERVER_IP'] ?>:3000/@vite/client"></script>
    <script type="module" src="http://<?= $_ENV['VITE_DEV_SERVER_IP'] ?>:3000/assets/js/main.js" defer></script>
<?php else: ?>
    <!-- Include the production build files -->
    <link rel="stylesheet" href="<?= AssetHelper::hashedAssetURL("css") ?>">
    <script src="<?= AssetHelper::hashedAssetURL("js")?>" type="module" defer></script>
<?php endif; ?>