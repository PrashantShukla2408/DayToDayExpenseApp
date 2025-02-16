document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

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
    premiumMessage.style.fontSize = "20px";
    document.body.prepend(premiumMessage);

    const leaderboardButton = document.createElement("button");
    leaderboardButton.textContent = "Leaderboard";
    document.body.appendChild(leaderboardButton);
    leaderboardButton.addEventListener("click", getLeaderboard);

    const reportButton = document.createElement("button");
    reportButton.textContent = "View Report";
    document.body.appendChild(reportButton);
    reportButton.addEventListener("click", async () => {
      window.location.href = "../../views/report.html";
    });
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
    leaderboardDiv.innerHTML = `<h2>Leaderboard</h2>`;
    leaderboard.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.innerHTML = `<p>${user.name} - ${user.totalExpense}</p>`;
      leaderboardDiv.appendChild(userDiv);
    });
    document.body.appendChild(leaderboardDiv);
  }

  getExpenses();
});
