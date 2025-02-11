async function clearRequest(redirectURL) {
    try {
        const response = await fetch("/api/logout.php", {
            method: "POST",
        });
        if (response.ok) { 
            window.location.href = redirectURL;
        } else {
            console.error("Logout failed:", response.statusText);
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
}


function clearSession(btn) {
    btn.addEventListener("click", () => {
        clearRequest("/login.php");
    });
}

export default function initLogout() {
    const logoutButton = document.querySelector("#logout");
    if (logoutButton) clearSession(logoutButton);
}