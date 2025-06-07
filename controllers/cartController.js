const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id });
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({ success: true, message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding item to cart', error: error.message });
  }
}

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price');

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving cart', error: error.message });
  }
}

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex > -1) {
      if (quantity <= 0) {
        // Remove item from cart
        cart.items.splice(existingItemIndex, 1);
      } else {
        // Update item quantity
        cart.items[existingItemIndex].quantity = quantity;
      }
    } else {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    await cart.save();

    res.status(200).json({ success: true, message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
  }
}

exports.deleteProductUsingId = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex > -1) {
      // Remove item from cart
      cart.items.splice(existingItemIndex, 1);
      await cart.save();
      return res.status(200).json({ success: true, message: 'Item removed from cart', cart });
    } else {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing item from cart', error: error.message });
  }
}

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing cart', error: error.message });
  }
}

exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Here you would typically handle payment processing and order creation
    // For simplicity, we'll just clear the cart after checkout

    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(200).json({ success: true, message: 'Checkout successful', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error during checkout', error: error.message });
  }
}

