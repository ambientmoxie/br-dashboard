import "../scss/main.scss";
import { initModeManager } from "./modules/mode-manager";
import initCustomSelect from "./modules/customSelect";
import clearSession from "./modules/logout";

document.addEventListener("DOMContentLoaded", () => {
    const isDashboardPage = document.body.id === "dashboard";
    const isAdminPage = document.body.id === "admin";
    const isLoginPage = document.body.id === "login";

    // Initialize project navigation in dashboard.
    if (isDashboardPage) { 
        initModeManager();
        initCustomSelect();
    }

    const logoutButton = document.querySelector("#btn-logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            clearSession("/login.php");
        });
    }

    // Dynamic year and hour
    if (isLoginPage) {
        const currentYear = document.querySelector("#current-year");
        currentYear.innerText = new Date().getFullYear();
        const currentTime = document.querySelector("#current-time");
        if (currentTime) animateCurrentTime(currentTime);
    }
});
