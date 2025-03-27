const express = require('express');
const trainController = require('../controllers/trainController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', trainController.getAllTrains);
router.get('/:id', trainController.getTrain);
router.get('/:trainId/availability/:coachType', trainController.checkSeatAvailability);

// Protected admin routes
router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', trainController.createTrain);
router.patch('/:id', trainController.updateTrain);
router.delete('/:id', trainController.deleteTrain);

module.exports = router;