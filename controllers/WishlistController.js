const Wishlist = require("../models/Wishlist");

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    // Check if the product is already in the wishlist
    const exists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    res.status(201).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.product",
      "title price sellingPrice images"
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Format each item to show only the first image
    const formattedWishlist = {
      ...wishlist._doc,
      items: wishlist.items.map((item) => {
        const product = item.product;
        return {
          _id: item._id,
          product: {
            _id: product._id,
            title: product.title,
            price: product.price,
            sellingPrice: product.sellingPrice,
            image: product.images?.[0]?.url || null, // First image or null
          },
        };
      }),
    };

    res.status(200).json(formattedWishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Find index of item with matching productId
    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove item by index
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.clearWishlist = async (req, res) => {
  const userId = req.user._id;

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({ message: "Wishlist cleared", wishlist });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

