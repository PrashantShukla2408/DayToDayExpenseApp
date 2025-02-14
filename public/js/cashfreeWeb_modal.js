const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("payButton").addEventListener("click", async () => {
  try {
    // Step 1: Create order by calling backend
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/payment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const orderId = data.order_id;

    // Step 2: Initialize Cashfree checkout modal
    const checkoutOptions = {
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_modal",
    };

    cashfree.checkout(checkoutOptions).then(async (result) => {
      console.log("Payment Response:", result);

      // Step 3: Verify payment with backend
      const verifyResponse = await axios.post(
        "http://localhost:5000/verify",
        {
          orderId: orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payment Status:", verifyResponse.data[0].payment_status);

      if (verifyResponse.data[0].payment_status == "SUCCESS") {
        alert("Payment successful");
        console.log("Payment has been completed");
        localStorage.setItem("isPremiumUser", "true");
      }
    });
  } catch (err) {
    console.error("Error:", err);
    alert("Payment processing failed. Please try again later.");
  }
});
