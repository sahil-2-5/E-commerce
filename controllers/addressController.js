const User = require("../models/User");

exports.addAddresses = async (req, res) => {
  const userId = req.user._id;
  const addressData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.addresses.push(addressData);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("addresses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.map((addr) => ({
      ...addr.toObject(),
      isDefault: addr._id.toString() === addressId,
    }));

    await user.save();
    res.status(200).json({
      success: true,
      message: "Default address set successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error setting default address",
      error: error.message,
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;
    const updatedData = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Update specific fields of the address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...updatedData,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

exports.deleteAddress = async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.addressId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.addresses.some((addr) => addr._id.toString() === addressId)) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting address",
      error: error.message,
    });
  }
};
