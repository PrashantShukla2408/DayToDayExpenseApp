document.addEventListener("DOMContentLoaded", async () => {
  const downloadList = document.getElementById("downloadList");
  async function getDownloadHistory() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to login first");
      window.location.href = "../../views/login.html";
    }
    const response = await axios.get(
      "http://localhost:5000/getDownloadHistory",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const downloads = response.data;
    downloads.forEach((download) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${download.fileURL}">Download ${download.filename}</a>
       `;
      downloadList.appendChild(li);
    });
  }
  getDownloadHistory();
});
