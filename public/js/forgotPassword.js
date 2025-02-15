document.addEventListener("DOMContentLoaded", () => {
  const forgotform = document.getElementById("forgotForm");
  forgotform.addEventListener("submit", handleFormSubmit);

  async function handleFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/password/forgotPassword",
      { email: email },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.message);
    alert("Password reset link sent to your email");
  }
});
