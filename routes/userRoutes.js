const express = require("express");
const router = express.Router();
const { validateEmail } = require("../validators/userValidator");
const { protect } = require("../middlewares/authMiddleware");
const {
  sendOtp,
  verifyOtp,
  addAddresses,
  logoutUser,
  setDefaultAddress,
  deleteAddress,
  updateAddress,
  getAddresses
} = require("../controllers/userController");

// Routes with `protect` middleware require a valid token

router.post("/login/send-otp", validateEmail, sendOtp);
router.post("/login/verify-otp", verifyOtp);
router.post("/logout", protect, logoutUser); 

router.get("/addresses", protect, getAddresses); 
router.post("/add-address", protect, addAddresses); 
router.post("/set-default-address", protect, setDefaultAddress); 
router.put("/update-address/:addressId", protect, updateAddress); 
router.delete("/delete-address/:addressId", protect, deleteAddress); 


module.exports = router;
