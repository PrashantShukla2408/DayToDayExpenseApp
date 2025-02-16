document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const dailyData = document.getElementById("dailyData");
  const dailyTotal = document.getElementById("dailyTotal");
  const dailyChart = document.getElementById("dailyChart");
  const weeklyData = document.getElementById("weeklyData");
  const weeklyTotal = document.getElementById("weeklyTotal");
  const weeklyChart = document.getElementById("weeklyChart");
  const monthlyData = document.getElementById("monthlyData");
  const monthlyTotal = document.getElementById("monthlyTotal");
  const monthlyChart = document.getElementById("monthlyChart");

  const downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", () => {
    window.print();
  });

  async function getDailyData() {
    try {
      const response = await axios.get("http://localhost:5000/getDailyData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      displayDailyData(data);
      createDailyChart(data);
    } catch (error) {
      console.log("Error fetching daily data: ", error);
    }
  }

  function displayDailyData(data) {
    dailyData.innerHTML = "";
    let total = 0;
    data.forEach((item) => {
      const dailyRow = document.createElement("tr");
      const formattedDate = new Date(item.createdAt).toLocaleDateString();
      dailyRow.innerHTML = `
            <td>${formattedDate}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>${item.amount}</td>
        `;
      dailyData.appendChild(dailyRow);
      total += Number(item.amount);
    });
    dailyTotal.textContent = `Total: ${total}`;
  }

  function createDailyChart(data) {
    const categories = {};
    data.forEach((item) => {
      if (categories[item.category]) {
        categories[item.category] += Number(item.amount);
      } else {
        categories[item.category] = Number(item.amount);
      }
    });

    const chartData = [["category", "amount"]];
    for (const [category, amount] of Object.entries(categories)) {
      chartData.push([category, amount]);
    }
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
      const chart = new google.visualization.PieChart(dailyChart);
      const dataTable = google.visualization.arrayToDataTable(chartData);
      const options = {
        title: "Category-wise Daily Expenses",
        pieHole: 0.4,
      };
      chart.draw(dataTable, options);
    });
  }

  async function getWeeklyData() {
    try {
      const response = await axios.get("http://localhost:5000/getWeeklyData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      displayWeeklyData(data);
      createWeeklyChart(data);
    } catch (error) {
      console.log("Error fetching weekly data:", error);
    }
  }

  function displayWeeklyData(data) {
    weeklyData.innerHTML = "";
    let total = 0;
    data.forEach((item) => {
      const formattedDate = new Date(item.createdAt).toLocaleDateString();
      const weeklyRow = document.createElement("tr");
      weeklyRow.innerHTML = `
            <td>${formattedDate}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>${item.amount}</td>
        `;
      total += Number(item.amount);
      weeklyData.appendChild(weeklyRow);
    });
    weeklyTotal.textContent = `Total: ${total}`;
  }

  function createWeeklyChart(data) {
    const categories = {};
    data.forEach((item) => {
      if (categories[item.category]) {
        categories[item.category] += Number(item.amount);
      } else {
        categories[item.category] = Number(item.amount);
      }
    });

    const chartData = [["category", "amount"]];
    for (const [category, amount] of Object.entries(categories)) {
      chartData.push([category, amount]);
    }
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
      const chart = new google.visualization.PieChart(weeklyChart);
      const dataTable = google.visualization.arrayToDataTable(chartData);
      const options = {
        title: "Category-wise Weekly Expenses",
        pieHole: 0.4,
      };
      chart.draw(dataTable, options);
    });
  }

  async function getMonthlyData() {
    try {
      const response = await axios.get("http://localhost:5000/getMonthlyData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      displayMonthlyData(data);
      createMonthlyChart(data);
    } catch (error) {
      console.log("Error fetching monthly data:", error);
    }
  }

  function displayMonthlyData(data) {
    monthlyData.innerHTML = "";
    let total = 0;
    data.forEach((item) => {
      const formattedDate = new Date(item.createdAt).toLocaleDateString();
      const monthlyRow = document.createElement("tr");
      monthlyRow.innerHTML = `
            <td>${formattedDate}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>${item.amount}</td>
        `;
      total += Number(item.amount);
      monthlyData.appendChild(monthlyRow);
    });
    monthlyTotal.textContent = `Total: ${total}`;
  }

  function createMonthlyChart(data) {
    const categories = {};
    data.forEach((item) => {
      if (categories[item.category]) {
        categories[item.category] += Number(item.amount);
      } else {
        categories[item.category] = Number(item.amount);
      }
    });

    const chartData = [["category", "amount"]];
    for (const [category, amount] of Object.entries(categories)) {
      chartData.push([category, amount]);
    }
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => {
      const chart = new google.visualization.PieChart(monthlyChart);
      const dataTable = google.visualization.arrayToDataTable(chartData);
      const options = {
        title: "Category-wise Monthly Expenses",
        pieHole: 0.4,
      };
      chart.draw(dataTable, options);
    });
  }

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
  getDailyData();
  getWeeklyData();
  getMonthlyData();
});
