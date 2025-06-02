const express = require("express");
const router = express.Router();
const { AuthAdminId } = require("../middlewares/authAdminMiddleware");
const upload = require("../middlewares/multerMiddleware");

const {
  sendOtp,
  verifyOtp,
  logoutAdmin,
} = require("../controllers/adminController");

const {
  getAddresses,
} = require("../controllers/addressController");

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Routes with `AuthAdminId` middleware require a valid token

// Admin Routes
router.post("/login/send-otp", sendOtp);
router.post("/login/verify-otp", verifyOtp);
router.post("/logout", AuthAdminId, logoutAdmin);

// Address Routes
router.get("/addresses", AuthAdminId, getAddresses);

// Product Routes
router.post("/add-product", AuthAdminId, upload.array("images"), addProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);
router.put("/update-product/:id", AuthAdminId, upload.array("images"), updateProduct);
router.delete("/delete-product/:id", AuthAdminId, deleteProduct);

module.exports = router;