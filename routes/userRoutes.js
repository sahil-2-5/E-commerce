const express = require("express");
const router = express.Router();
const { AuthClientId } = require("../middlewares/authClientMiddleware");
const { validateEmail } = require("../validators/userValidator");

const {
  sendOtp,
  verifyOtp,
  logoutUser,
} = require("../controllers/userController");

const {
  getAddresses,
  addAddresses,
  setDefaultAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

// Routes with `AuthClientId` middleware require a valid token

// User Routes
router.post("/login/send-otp", validateEmail, sendOtp);
router.post("/login/verify-otp", verifyOtp);
router.post("/logout", AuthClientId, logoutUser);

// Address Routes
router.get("/addresses", AuthClientId, getAddresses);
router.post("/add-address", AuthClientId, addAddresses);
router.post("/set-default-address", AuthClientId, setDefaultAddress);
router.put("/update-address/:addressId", AuthClientId, updateAddress);
router.delete("/delete-address/:addressId", AuthClientId, deleteAddress);

// Product Routes
router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);

module.exports = router;
