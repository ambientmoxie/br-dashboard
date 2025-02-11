# Banner Review Dashboard

![banner](https://github.com/user-attachments/assets/ba64df21-fe2c-43b3-8cb6-694cdd200d17)

## Introduction

### What is this?
The **Banner Review Dashboard** is a PHP-based platform for hosting and displaying HTML5 banner campaigns, enabling clients to review banners during the development phase. Clients can switch between variations, versions, and languages, and toggle between viewing banners individually or all at once. An **admin page** provides quick access to all campaigns without requiring a password.

### Why PHP?
Although modern JavaScript frameworks are typically better suited for such tools, PHP was chosen due to the original project's requirement to be hosted on a PHP Apache server.

### How does it work?
The banners are stored in a structured `production` directory, and the tool parses this directory into an array upon first load. This array is used to initialize the dashboard, with no further server requests required during user interaction, as all data is passed to the DOM at load time.

## Key Files

### Folder structure

    api/
    ├── check-password.php
    └── logout.php
    assets/
    ├── php/
    │   ├── helpers/
    │   └── modules/
    │       ├── asset-helper.php
    │       ├── element-builder.php
    │       └── production-manager.php
    └── js/
        ├── main.js
        └── modules/
            ├── logout.js
            ├── mode-manager.js
            ├── collapsible-handler.js
            └── ui-manager.js
    production/
    ├── brand-1/
    │   ├── variation-1/
    │   │   └── version-1/
    │   │       ├── language-1/
    │   │       │   └── index.html
    │   │       ├── language-2/
    │   │       │   └── index.html
    │   │       └── etc.
    │   ├── variation-2/
    │   │   ├── version-1/
    │   │   │   ├── language-1/
    │   │   │   │   └── index.html
    │   │   │   ├── language-2/
    │   │   │   │   └── index.html
    │   │   │   └── etc.
    │   │   └── etc.
    │   └── etc.
    └── etc.
    index.php
    admin.php
    login.php
    router.php
    .env

### Main files

- **index.php**: The main dashboard where clients can review the banner campaigns.
- **login.php**: Handles user authentication and redirects users to the appropriate page (dashboard or admin).
- **admin.php**: The admin panel where all campaigns can be accessed with one click, without requiring a password.
- **router.php**: Used during development to serve static files with PHP's built-in server. This file is unnecessary if using tools like MAMP or Laravel Valet.

### Assets and Utilities
- **assets/php/**: Contains modules like:
  - `element-builder.php`: Builds the UI based on parsed production data.
  - `production-manager.php`: Parses the `production` directory into an object representing its structure.
  - `asset-helper.php`: Manages javascript and sass assets.
- **assets/js/**: Includes javascript modules like:
  - `ui-manager.js`: Handles UI updates based on user interactions.
  - `mode-manager.js`: Manages single-banner and multi-banner view modes.
  - `collapsible-handler.js`: Handles dashboard dropdown sections.
- **.env**: Stores environment variables:
  - `VITE_DEV_SERVER_IP`: Used for development with Vite's HMR.
  - `VITE_DEV`: Automatically updated by set-env.js.
  - `VITE_ROOT`: Must be updated manually if the app is in a subdirectory.

## How to Install

### Prerequisites
- PHP installed with Composer.
- Node.js installed with npm.

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ambientmoxie/br-dashboard.git
2. Install dependencies:
   ```bash
   cd folder
   npm install
   composer install
3. Remove the old Git history:
   ```bash
   rm -rf .git
4. Update the .env file with your local IP address.

### Create you first project
1. Add your first project to the production directory. The structure MUST follow this pattern.
   ```markdown
   production/
    └── brand-1/
        └── variation-1/
            └── version-1/
                └── language-1/
                    └── index.html

> **Note:** All names (e.g., `brand-1`, `variation-1`, etc.) will be treated as strings and can be changed to match the names of the brand, version, variation, or language. **Spaces are not allowed** in names. Replace all spaces with hyphens (`-`) to avoid issues.
         
2. Add a password to this project to secure access through `login.php`. To do this, update the password array inside the `ProductionManager` class located in `assets/php/modules/production-manager.php`.

3. By default, the tool displays the first available variation, the latest version, and the first available language for the current project. You can modify these values by updating the `$defaultVar`, `$defaultVer`, and `$defaultLang` variables inside `index.php`.

### Start the server and/or build for production
1. Start the development server which concurently will run the HMR vite server and PHP built-in server:
    ```bash
    npm run dev
2. Access the platform in your browser at localhost:8000. Use the password admin to log in to the admin panel and access the dashboard.

3. Build the assets for production. Don't forget to assign subfolder in .env if needed:
    ```bash
    npm run build

### Notes

- This platform is not bug-free or even secure. It is a personal tool designed to simplify the management and review of HTML5 banners during the development process.
- The tool is provided "as is" and is not intended for resale. You are welcome to adapt it for your specific needs if you plan to use it professionally.
- More information about the asset bundling can be found here: https://github.com/ambientmoxie/starterkit-php-node.

### Todo

- Add update capabilities to the platform via the admin panel. Currently, the platform requires manual updates to the `production` directory structure, which is not ideal for non-dev users.
- Improve the platform's usability and robustness to make it less prone to errors caused by misconfigured folder structures.
- Using htmx for UI update?
