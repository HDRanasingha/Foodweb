import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
const stripeClient = Stripe(process.env.STRIPE_SECRET_KEY);

// Placing a user order
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, token } = req.body;

    // Validate user ID
    if (!userId) {
      return res.json({ success: false, message: 'User ID is required' });
    }

    // Validate items
    if (!items || items.length === 0) {
      return res.json({ success: false, message: 'Order items are required' });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.json({ success: false, message: 'Order amount must be greater than zero' });
    }

    // Validate address
    if (!address || Object.keys(address).length === 0) {
      return res.json({ success: false, message: 'Delivery address is required' });
    }

    // Create a new order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: 'Food Processing',
      payment: false
    });

    // Save the order to the database
    await newOrder.save();

    // Process payment with Stripe
    const charge = await stripeClient.charges.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      source: token,
      description: `Order ${newOrder._id}`
    });

    // Update order payment status
    newOrder.payment = true;
    await newOrder.save();

    res.json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!userId) {
      return res.json({ success: false, message: 'User ID is required' });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate order ID
    if (!orderId) {
      return res.json({ success: false, message: 'Order ID is required' });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error', error: error.message });
  }
};
