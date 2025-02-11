function togglePassword(inputPassword) {

    // Get elements
    const togglePassword = inputPassword.nextElementSibling;
    const eyeOpen = togglePassword.querySelector("span#eye-open");
    const eyeClosed = togglePassword.querySelector("span#eye-closed");

    togglePassword.addEventListener("click", function () {
        // Toggle password visibility
        const isPasswordVisible = inputPassword.type === "text";
        inputPassword.type = isPasswordVisible ? "password" : "text";

        // Toggle icons
        eyeOpen.style.display = isPasswordVisible ? "none" : "inline";
        eyeClosed.style.display = isPasswordVisible ? "inline" : "none";
    });
}


export default function initTogglePassword(){
    const inputPassword = document.querySelector("input#password");
    if (inputPassword) togglePassword(inputPassword);
}