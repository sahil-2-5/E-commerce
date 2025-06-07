const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["razorpay"],
    default: "razorpay"
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
