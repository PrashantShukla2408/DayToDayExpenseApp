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
  }

  const expenseForm = document.getElementById("expenseForm");
  const expenseList = document.getElementById("expenseList");
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

  function getExpenses() {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/expenses/getExpenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const expenses = response.data;
        expenses.forEach((expense) => {
          const expenseDiv = document.createElement("div");
          expenseDiv.classList.add("expenseItem");
          expenseDiv.innerHTML = `
                    <p>${expense.amount} - ${expense.description} - ${expense.category}</p>
                    <button onclick="deleteExpense(${expense.expenseId})">Delete</button
                `;
          expenseList.appendChild(expenseDiv);
        });
      });
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
