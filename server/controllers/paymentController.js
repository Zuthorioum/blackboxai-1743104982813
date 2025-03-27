const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (err) {
    next(new AppError('Failed to create payment order', 500));
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return next(new AppError('Payment verification failed', 400));
    }

    await Booking.findOneAndUpdate(
      { paymentOrderId: razorpay_order_id },
      { 
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        status: 'confirmed' 
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully'
    });
  } catch (err) {
    next(new AppError('Payment verification failed', 500));
  }
};

const handleWebhook = async (req, res) => {
  const { event, payload } = req.body;
  const signature = req.headers['x-razorpay-signature'];
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ status: 'error' });
  }

  switch (event) {
    case 'payment.captured':
      await handleSuccessfulPayment(payload.payment.entity);
      break;
    case 'payment.failed':
      await handleFailedPayment(payload.payment.entity);
      break;
  }

  res.json({ status: 'ok' });
};

async function handleSuccessfulPayment(payment) {
  await Booking.findOneAndUpdate(
    { paymentOrderId: payment.order_id },
    { 
      paymentStatus: 'paid',
      paymentId: payment.id,
      status: 'confirmed' 
    }
  );
}

async function handleFailedPayment(payment) {
  await Booking.findOneAndUpdate(
    { paymentOrderId: payment.order_id },
    { 
      paymentStatus: 'failed',
      status: 'cancelled' 
    }
  );
}

module.exports = { createOrder, verifyPayment, handleWebhook };