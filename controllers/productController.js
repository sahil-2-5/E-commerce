const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");
const uploadToCloudinary = require("../uploads/cloudinaryStorage");

exports.addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const imageData = await uploadToCloudinary(file.buffer, "products");

      imageUrls.push({
        id: imageData.public_id || imageData.id || uuidv4(),
        url: imageData.secure_url || imageData.url,
      });
    }

    const description = req.body.description
      ? JSON.parse(req.body.description)
      : {};

    const filter = req.body.filter ? JSON.parse(req.body.filter) : null;
    if (!filter) {
      return res
        .status(400)
        .json({ success: false, message: "Filter data is required" });
    }

    const productData = {
      ...req.body,
      images: imageUrls,
      description,
      filter,
      user: req.admin._id,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true,
    };

    const product = await Product.create(productData);
    res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse description and filter if sent as JSON strings
    if (req.body.description && typeof req.body.description === "string") {
      try {
        req.body.description = JSON.parse(req.body.description);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in description",
        });
      }
    }

    // Parse filter if it's a string
    if (req.body.filter && typeof req.body.filter === "string") {
      try {
        req.body.filter = JSON.parse(req.body.filter);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in filter",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSingleImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const imageIndex = product.images.findIndex((img) => img.id === imageId);
    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found in product" });
    }

    // Upload new image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, "products");

    // Extract URL safely depending on what uploadToCloudinary returns
    let newUrl = "";
    if (typeof uploadResult === "string") {
      newUrl = uploadResult;
    } else if (uploadResult && typeof uploadResult.url === "string") {
      newUrl = uploadResult.url;
    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid upload result from Cloudinary",
      });
    }

    const newImage = {
      id: uuidv4(),
      url: newUrl,
    };

    // Replace old image
    product.images[imageIndex] = newImage;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating image",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
