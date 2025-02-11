class TimeFormatter {
    constructor(container) {
        this.container = container;
    }

    fullDate() {
        const now = new Date();
        const options = { month: "long", day: "numeric", year: "numeric" };
        const formattedDate = now.toLocaleDateString("en-US", options);

        let hours = now.getHours();
        let minutes = now.getMinutes().toString().padStart(2, "0");
        let period = hours >= 12 ? "pm" : "am";

        hours = hours % 12 || 12;

        const formattedTime = `${formattedDate} ■ ${hours}:${minutes}${period}`;
        this.container.textContent = formattedTime;
    }

    compressedDate() {
        const now = new Date();
        let day = now.getDate().toString().padStart(2, "0");
        let month = (now.getMonth() + 1).toString().padStart(2, "0");
        let year = now.getFullYear().toString().slice(-2);

        const formattedDate = `${day}${month}${year}`;
        this.container.textContent = formattedDate;
    }
}

export default function initTimeFormater() {
    const timeContainer = document.getElementById("current-time");
    if (timeContainer) {
        const timeFormater = new TimeFormatter(timeContainer);
        timeFormater.fullDate();
    }

    const compressedDate = document.getElementById("compressed-date");
    if (compressedDate) {
        const timeFormater = new TimeFormatter(compressedDate);
        timeFormater.compressedDate();
    }
}
