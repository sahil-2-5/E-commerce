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
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateSingleImage,
  deleteProduct,
} = require("../controllers/productController");

const {
  createOrder ,
  verifyPayment
} = require("../controllers/orderController");

// Routes with `AuthAdminId` middleware require a valid token

// Admin Routes
router.post("/login/send-otp", sendOtp);
router.post("/login/verify-otp", verifyOtp);
router.post("/logout", AuthAdminId, logoutAdmin);

// Product Routes
router.post("/add-product", AuthAdminId, upload.array("images"), addProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);
router.put("/update-product/:id", AuthAdminId,upload.none(), updateProduct);
router.put("/update-image/:productId/:imageId", AuthAdminId, upload.single("image"), updateSingleImage);
router.delete("/delete-product/:id", AuthAdminId, deleteProduct);

// Order Routes
router.post("/create-order", AuthAdminId, createOrder);
router.post("/verify-payment", AuthAdminId, verifyPayment);

module.exports = router;