export default async function clearSession(redirectURL) {
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

