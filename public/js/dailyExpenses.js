document.addEventListener("DOMContentLoaded", () => {
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

    axios
      .post("http://localhost:5000/expenses/addExpense", expenseData, {
        headers: {
          "Content-Type": "application/json",
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
    axios.get("http://localhost:5000/expenses/getExpenses").then((response) => {
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
    axios
      .delete(`http://localhost:5000/expenses/deleteExpense/${expenseId}`)
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

  getExpenses();
});
