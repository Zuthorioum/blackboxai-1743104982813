const Booking = require('../models/Booking');
const Train = require('../models/Train');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createBooking = catchAsync(async (req, res, next) => {
  const { trainId, passengers, journeyDate } = req.body;
  const userId = req.user.id;

  // 1) Get the train and check availability
  const train = await Train.findById(trainId);
  if (!train) {
    return next(new AppError('No train found with that ID', 404));
  }

  // 2) Check seat availability for each passenger
  const coachCounts = {};
  passengers.forEach(passenger => {
    coachCounts[passenger.coach] = (coachCounts[passenger.coach] || 0) + 1;
  });

  for (const [coach, count] of Object.entries(coachCounts)) {
    const available = train.seats[coach].total - train.seats[coach].booked;
    if (available < count) {
      return next(new AppError(`Not enough seats available in ${coach} class`, 400));
    }
  }

  // 3) Calculate total fare
  let totalFare = 0;
  passengers.forEach(passenger => {
    totalFare += train.seats[passenger.coach].price;
  });

  // 4) Create booking
  const booking = await Booking.create({
    user: userId,
    train: trainId,
    passengers,
    journeyDate,
    totalFare
  });

  // 5) Update booked seats count
  for (const [coach, count] of Object.entries(coachCounts)) {
    train.seats[coach].booked += count;
  }
  await train.save();

  // 6) Add booking to user's history
  await User.findByIdAndUpdate(userId, {
    $push: { bookings: booking._id }
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking
    }
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user owns the booking
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to cancel this booking', 403));
  }

  // Update train seat availability
  const train = await Train.findById(booking.train);
  const coachCounts = {};
  booking.passengers.forEach(passenger => {
    coachCounts[passenger.coach] = (coachCounts[passenger.coach] || 0) + 1;
  });

  for (const [coach, count] of Object.entries(coachCounts)) {
    train.seats[coach].booked = Math.max(0, train.seats[coach].booked - count);
  }
  await train.save();

  // Update booking status
  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

exports.getUserBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .sort('-createdAt')
    .populate('train');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find()
    .sort('-createdAt')
    .populate('train')
    .populate('user', 'name email');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('train')
    .populate('user', 'name email');

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check authorization
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to view this booking', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});