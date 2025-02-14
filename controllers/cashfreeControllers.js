const { Cashfree } = require("cashfree-pg");
const shortid = require("shortid");

const User = require("../models/userModel");

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRETKEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = shortid.generate();
    const request = {
      order_id: orderId,
      order_amount: "2000",
      order_currency: "INR",
      customer_details: {
        customer_id: String(userId),
        customer_phone: "9999999999",
      },
    };

    Cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        console.log(response.data);
        res.json(response.data);
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
  } catch (error) {
    console.error(error);
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const userId = req.userId;
    let { orderId } = req.body;

    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then(async (response) => {
        res.json(response.data);
        if (response.data[0].payment_status === "SUCCESS") {
          await User.update(
            { isPremium: true }, // Values to update
            { where: { id: userId } } // Condition to find the user
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.log(error);
  }
};
