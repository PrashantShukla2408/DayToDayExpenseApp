document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      document.getElementById("resetStatus").textContent =
        "Reset token not found";
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/password/resetPassword/${resetToken}`,
        { password }
      );
      document.getElementById("resetStatus").textContent =
        response.data.message;
      localStorage.removeItem("resetToken");
    } catch (error) {
      console.error(error);
      document.getElementById("resetStatus").textContent =
        "Error resetting password";
    }
  });
