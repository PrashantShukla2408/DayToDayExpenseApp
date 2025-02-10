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
        alert("User Logged in successfully");
        console.log(response.data);
        loginStatus.innerHTML = `
            <p>${response.message}</p>
        `;
      })
      .catch((err) => {
        alert("Error logging in user");
        console.log(err);
        loginStatus.innerHTML = `
            <p>${response.message}</p>
        `;
      });
  }
});
