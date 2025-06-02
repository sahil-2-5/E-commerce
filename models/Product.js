const mongoose = require('mongoose');

const descriptionSchema = new mongoose.Schema({
  information: { type: String },
  fabric: { type: String },
  style: { type: String },
  length: { type: String },
  width: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema({
  images: [{ 
     type: String,
     required: true 
   }],
  title: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    required: true
  },
  price: { 
    type: Number, 
    required: true 
  },
  sellingPrice: { 
    type: Number, 
    required: true 
  },
  description: {
    type: descriptionSchema,
    required: true
  },
  offerPercentage: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);
