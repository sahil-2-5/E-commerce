const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const imageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const descriptionSchema = new mongoose.Schema(
  {
    information: { type: String },
    fabric: { type: String },
    style: { type: String },
    length: { type: String },
    width: { type: String },
  },
  { _id: false }
);

const filterSchema = new mongoose.Schema(
  {
    material: {
      type: String, // Silk, Cotton, Georgette, etc.
      required: true,
    },
    occasion: {
      type: String, // Wedding, Party, Casual, etc.
      required: true,
    },
    color: {
      type: String, // e.g., Red, Blue, Green, etc.
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  images: {
    type: [imageSchema],
    required: true,
  },
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  description: {
    type: descriptionSchema,
    required: true,
  },
  filter: {
    type: filterSchema,
    required: true,
  },
  offerPercentage: { type: Number, required: true },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

module.exports = mongoose.model("Product", productSchema);
