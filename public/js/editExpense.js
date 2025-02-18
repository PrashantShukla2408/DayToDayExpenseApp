document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const expenseId = urlParams.get("expenseId");
  const editExpenseForm = document.getElementById("editExpenseForm");
  editExpenseForm.addEventListener("submit", handleFormSubmit);
  console.log("ExpenseId: ", expenseId);

  if (expenseId) {
    try {
      const token = localStorage.getItem("token");
      console.log("Token: ", token);
      const response = await axios.get(
        `http://localhost:5000/expenses/getExpense/${expenseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const expense = response.data;
      document.getElementById("amount").value = expense.amount;
      document.getElementById("description").value = expense.description;
      document.getElementById("category").value = expense.category;
    } catch (error) {
      console.log("Error fetching expense: ", error);
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    const expenseData = {
      amount: amount,
      description: description,
      category: category,
    };
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/expenses/editExpense/${expenseId}`,
        expenseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Expense updated successfully");
      window.location.href = "../../views/dailyExpenses.html";
    } catch (error) {
      console.log("Error updating expense: ", error);
      alert("Error updating expense");
    }
  }
});
