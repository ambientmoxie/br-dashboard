function updateTime(container) {
    const now = new Date();

    // Get the current hours, minutes, and seconds
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Get the time zone offset in hours
    const offset = now.getTimezoneOffset() / -60; // Negative because UTC offset is inverted
    const sign = offset >= 0 ? "+" : "-";
    const formattedOffset = `UTC ${sign}${Math.abs(offset)}`;

    // Combine everything into the desired format
    const timeString = `${hours}:${minutes}:${seconds} (${formattedOffset})`;

    // Display the time
    container.textContent = timeString;
}

export default function animateCurrentTime(container) {
    // Initial display
    updateTime(container);

    // Update every second
    setInterval(() => updateTime(container), 1000);
}
