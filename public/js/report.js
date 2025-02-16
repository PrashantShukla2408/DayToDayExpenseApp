document.addEventListener("DOMContentLoaded", () => {
  function formatDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12;
    minutes = minutes.toString().padStart(2, "0");

    const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;

    document.getElementById("date").textContent = formattedDate;
    document.getElementById("month").textContent = month + " " + year;
  }
  formatDate();
});
