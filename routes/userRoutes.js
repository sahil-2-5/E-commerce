const express = require("express");
const router = express.Router();
const { AuthClientId } = require("../middlewares/authClientMiddleware");
const { validateEmail } = require("../validators/userValidator");

// const {
//   sendOtp,
//   verifyOtp,
//   logoutUser,
// } = require("../controllers/userController");

const {
  signup,
  verifySignupOtp,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  logoutUser
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

const {
  addToCart,
  getCart,
  updateCartItem,
  deleteProductUsingId,
  clearCart,
  checkout
} = require("../controllers/cartController");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} = require("../controllers/wishlistController");

// Routes with `AuthClientId` middleware require a valid token

// User Routes
// router.post("/login/send-otp", validateEmail, sendOtp);
// router.post("/login/verify-otp", verifyOtp);
//router.post("/logout", AuthClientId, logoutUser);

// User Routes
router.post("/signup", signup);
router.post("/signup/verify-otp", verifySignupOtp);
router.post("/login", login);
router.post("/forgot-password", validateEmail, forgotPassword);
router.post("/reset-password/verify-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
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

// Cart Routes
router.post("/cart/add", AuthClientId, addToCart);
router.get("/cart", AuthClientId, getCart);
router.put("/cart/update", AuthClientId, updateCartItem);
router.delete("/cart/clear", AuthClientId, clearCart);
router.delete("/cart/delete/:productId", AuthClientId, deleteProductUsingId);
router.post("/cart/checkout", AuthClientId, checkout);

// Wishlist Routes
router.post("/wishlist/add", AuthClientId, addToWishlist);
router.get("/wishlist", AuthClientId, getWishlist);
router.delete("/wishlist/remove/:productId", AuthClientId, removeFromWishlist);
router.delete("/wishlist/clear", AuthClientId, clearWishlist);

module.exports = router;
