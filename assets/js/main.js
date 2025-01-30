import "../scss/main.scss";
import { initModeManager } from "./modules/mode-manager";
import initCustomSelect from "./modules/customSelect";
import clearSession from "./modules/logout";

document.addEventListener("DOMContentLoaded", () => {

    // Initialize project navigation in dashboard.
    const isDashboardPage = document.body.id === "dashboard";
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

    // Display dashboard body, after all js transformation have been applied
    const dashboardBody = document.querySelector("body#dashboard");
    if (dashboardBody) {
        requestAnimationFrame(() => {
            dashboardBody.style.overflow = "auto";
            dashboardBody.style.opacity = "1";
        });
    }
});
