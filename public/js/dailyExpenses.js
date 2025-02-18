document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  const currentTheme = localStorage.getItem("theme") || "light";

  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.textContent = "🌞 Light Mode";
  } else {
    document.body.classList.add("light-mode");
    themeToggleBtn.textContent = "🌙 Dark Mode";
  }

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeToggleBtn.textContent = "🌞 Light Mode";
    } else {
      localStorage.setItem("theme", "light");
      themeToggleBtn.textContent = "🌙 Dark Mode";
    }
  });

  const response = await axios.get("http://localhost:5000/users/userStatus", {
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.data;
  if (data.isPremiumUser) {
    alert("You are a premium user");
    const premiumMessage = document.createElement("div");
    premiumMessage.textContent = "You are a premium user!";
    premiumMessage.style.color = "gold";
    premiumMessage.style.fontSize = "18px";
    premiumMessage.style.fontWeight = "bold";
    premiumMessage.style.textAlign = "center";
    premiumMessage.style.marginTop = "10px";
    const heading = document.querySelector("h3");
    heading.insertAdjacentElement("afterend", premiumMessage);

    const leaderboardButton = document.createElement("button");
    leaderboardButton.textContent = "Leaderboard";
    leaderboardButton.id = "leaderboardButton";
    document.body.appendChild(leaderboardButton);
    leaderboardButton.addEventListener("click", getLeaderboard);

    const reportButton = document.createElement("button");
    reportButton.textContent = "View Report";
    reportButton.id = "reportButton";
    document.body.appendChild(reportButton);
    reportButton.addEventListener("click", async () => {
      window.location.href = "../../views/report.html";
    });

    const downloadReportButton = document.createElement("button");
    downloadReportButton.textContent = "Download Report";
    downloadReportButton.id = "downloadReportButton";
    downloadReportButton.addEventListener("click", handleDownload);
    document.body.appendChild(downloadReportButton);

    const downloadHistory = document.createElement("button");
    downloadHistory.textContent = "Download History";
    downloadHistory.id = "downloadHistory";
    downloadHistory.addEventListener("click", () => {
      window.location.href = "../../views/downloadHistory.html";
    });
    document.body.appendChild(downloadHistory);
  }

  const expenseForm = document.getElementById("expenseForm");
  const expenseList = document.getElementById("expenseList");

  const rowsForm = document.getElementById("rowsForm");
  rowsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const rows = parseInt(document.getElementById("rowsPerPage").value);
    localStorage.setItem("rowsPerPage", rows);
    getExpenses(1, rows);
  });

  const expensesPagination = document.getElementById("expensesPagination"); // pagination
  const itemsPerPage = parseInt(localStorage.getItem("rowsPerPage")) || 5;

  expenseForm.addEventListener("submit", handleFormSubmit);

  function handleFormSubmit(event) {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    const expenseData = {
      amount: amount,
      description: description,
      category: category,
    };

    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:5000/expenses/addExpense", expenseData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("Expense added successfully");
        getExpenses();
      })
      .catch((err) => {
        console.log(err);
        alert("Error adding expense");
      });
  }

  async function getExpenses(page = 1, limit = itemsPerPage) {
    try {
      const response = await axios.get(
        `http://localhost:5000/expenses/getExpenses?page=${page}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      displayExpenses(data.items);
      setupPagination(expensesPagination, data.totalPages, page, getExpenses);
    } catch (error) {
      console.log("Error fetching expenses: ", error);
    }
  }

  function displayExpenses(data) {
    expenseList.innerHTML = "";
    data.forEach((item) => {
      const expenseItem = document.createElement("div");
      expenseItem.classList.add("expense-item");
      expenseItem.innerHTML = `
        <p> ${item.amount} - ${item.description} -${item.category}</p>
        <button id='deleteButton' onclick='deleteExpense(${item.expenseId})'>Delete</button>
        <button id='editButton' onclick='editExpense(${item.expenseId})'>Edit</button>
      `;
      expenseList.appendChild(expenseItem);
    });
  }

  function setupPagination(
    paginationElement,
    totalPages,
    currentPage,
    fetchDataFunction
  ) {
    paginationElement.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("li");
      pageItem.classList.add("page-item");
      if (i === currentPage) {
        pageItem.classList.add("active");
      }
      const pageLink = document.createElement("a");
      pageLink.classList.add("page-link");
      pageLink.href = "#";
      pageLink.textContent = i;
      pageLink.addEventListener("click", () => {
        fetchDataFunction(i, itemsPerPage);
      });
      pageItem.appendChild(pageLink);
      paginationElement.appendChild(pageItem);
    }
  }

  function deleteExpense(expenseId) {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://localhost:5000/expenses/deleteExpense/${expenseId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("Expense deleted successfully");
        getExpenses();
      })
      .catch((err) => {
        console.log(err);
        alert("Error deleting expense");
      });
  }
  window.deleteExpense = deleteExpense;

  function editExpense(expenseId) {
    window.location.href = `../../views/editExpense.html?expenseId=${expenseId}`;
  }
  window.editExpense = editExpense;

  async function getLeaderboard() {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:5000/premium/leaderboard",
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const leaderboard = response.data;
    const leaderboardDiv = document.createElement("div");
    leaderboardDiv.id = "leaderboardDiv";
    leaderboardDiv.innerHTML = `<h2>Leaderboard</h2>`;
    leaderboard.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.innerHTML = `<p>${user.name} - ${user.totalExpense}</p>`;
      leaderboardDiv.appendChild(userDiv);
    });
    document.body.appendChild(leaderboardDiv);
  }

  async function handleDownload() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/downloadReport", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fileURL = response.data.fileURL;
      const a = document.createElement("a");
      a.href = fileURL;
      a.download = "report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log("Report downloaded successfully");
    } catch (error) {
      console.log("Error downloading report: ", error);
    }
  }

  getExpenses();
});
