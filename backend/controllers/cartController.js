import userModel from '../models/userModel.js';

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId; // Use userId from middleware

    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId; // Use userId from middleware

    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }

      await userModel.findByIdAndUpdate(userId, { cartData });
      res.json({ success: true, message: "Removed from Cart" });
    } else {
      res.json({ success: false, message: "Item not in cart" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    const userId = req.userId; // Use userId from middleware

    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching cart data" });
  }
};

export { addToCart, removeFromCart, getCart };





