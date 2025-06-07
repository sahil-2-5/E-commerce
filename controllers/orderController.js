const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ error: "Failed to create order" });
    }
    res.status(200).json({
      success: true,
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      totalAmount,
    } = req.body;
    const userId = req.user._id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    } else {
      const order = new Order({
        orderId: "ORDER-" + uuidv4().slice(0, 8).toUpperCase(),
        user: userId,
        items,
        shippingAddress,
        totalAmount,
        paymentMethod: "razorpay",
        paymentStatus: "completed",
        orderStatus: "pending",
        isPaid: true,
        paidAt: new Date(),
        paymentStatus: "completed",
      });

      await order.save();

      res.status(200).json({
        success: true,
        message: "Payment verified and order created successfully",
        order,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
