const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

// Admin-only routes
router.use(authController.restrictTo('admin'));
router.get('/', bookingController.getAllBookings);

module.exports = router;