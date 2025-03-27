const express = require('express');
const { protect } = require('../controllers/authController');
const { 
  createOrder, 
  verifyPayment, 
  handleWebhook 
} = require('../controllers/paymentController');

const router = express.Router();

// Create Razorpay order
router.post('/create-order', protect, createOrder);

// Verify payment
router.post('/verify', protect, verifyPayment);

// Webhook endpoint
router.post('/webhook', express.json({ type: 'application/json' }), handleWebhook);

module.exports = router;