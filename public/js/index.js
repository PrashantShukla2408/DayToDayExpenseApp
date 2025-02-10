document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.getElementById("signUpForm");
  const signUpStatus = document.getElementById("signUpStatus");

  signUpForm.addEventListener("submit", handleFormSubmit);

  function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:5000/users/postUser", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        signUpStatus.innerHTML = `
                <p class='text-primary'>User signed up successfully</p>
            `;
        signUpForm.reset();
      })
      .catch((err) => {
        console.log(err);
        signUpStatus.innerHTML = `
                <p class='text-danger'>Signup Error</p>
            `;
      });
  }
});
