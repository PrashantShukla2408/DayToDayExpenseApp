document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginStatus = document.getElementById("loginStatus");

  loginForm.addEventListener("submit", handleFormSubmit);

  function handleFormSubmit(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:5000/users/login", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        loginStatus.innerHTML = `
            <p>${response.data.message}</p>
        `;
        alert("User Logged in successfully");
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        window.location.href = "../../views/dailyExpenses.html";
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Something went wrong. Try again"; // ?. optional chaining
        loginStatus.innerHTML = `
              <p>${errorMessage}</p>
          `;
        alert("Error logging in user");
        console.log(err);
      });
  }
});
