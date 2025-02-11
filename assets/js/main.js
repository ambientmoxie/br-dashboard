import "../scss/main.scss";

import initLogout from "./modules/logout";
import initModeManager from "./modules/mode-manager";
import initTimeFormater from "./modules/time-formater";
import initTogglePassword from "./modules/toggle-password";
import initCollapsibles from "./modules/collapsible-handler";

document.addEventListener("DOMContentLoaded", () => {
    initTogglePassword();
    initTimeFormater();
    initCollapsibles();
    initModeManager(); 
    initLogout();
});
