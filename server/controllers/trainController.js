const Train = require('../models/Train');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Helper function to build filter object
const buildFilter = query => {
  const filter = {};
  if (query.source) filter.source = query.source;
  if (query.destination) filter.destination = query.destination;
  if (query.date) {
    const day = new Date(query.date).toLocaleDateString('en-US', { weekday: 'short' });
    filter.runningDays = day;
  }
  return filter;
};

exports.getAllTrains = catchAsync(async (req, res, next) => {
  const filter = buildFilter(req.query);
  
  const trains = await Train.find(filter).sort('departureTime');
  
  res.status(200).json({
    status: 'success',
    results: trains.length,
    data: {
      trains
    }
  });
});

exports.getTrain = catchAsync(async (req, res, next) => {
  const train = await Train.findById(req.params.id);
  
  if (!train) {
    return next(new AppError('No train found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      train
    }
  });
});

exports.createTrain = catchAsync(async (req, res, next) => {
  const newTrain = await Train.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      train: newTrain
    }
  });
});

exports.updateTrain = catchAsync(async (req, res, next) => {
  const train = await Train.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!train) {
    return next(new AppError('No train found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      train
    }
  });
});

exports.deleteTrain = catchAsync(async (req, res, next) => {
  const train = await Train.findByIdAndDelete(req.params.id);

  if (!train) {
    return next(new AppError('No train found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.checkSeatAvailability = catchAsync(async (req, res, next) => {
  const { trainId, coachType } = req.params;
  const { journeyDate } = req.query;

  const train = await Train.findById(trainId);
  if (!train) {
    return next(new AppError('No train found with that ID', 404));
  }

  // In a real app, we would check bookings for this date
  const availableSeats = train.seats[coachType].total - train.seats[coachType].booked;

  res.status(200).json({
    status: 'success',
    data: {
      availableSeats,
      totalSeats: train.seats[coachType].total,
      price: train.seats[coachType].price
    }
  });
});