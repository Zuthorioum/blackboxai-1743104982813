const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  train: {
    type: mongoose.Schema.ObjectId,
    ref: 'Train',
    required: [true, 'Booking must belong to a train']
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  },
  passengers: [{
    name: String,
    age: Number,
    gender: String,
    seatNumber: String,
    coach: String
  }],
  journeyDate: {
    type: Date,
    required: [true, 'Booking must have a journey date']
  },
  totalFare: {
    type: Number,
    required: [true, 'Booking must have a total fare']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'waiting'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate PNR before saving
bookingSchema.pre('save', function(next) {
  if (!this.pnr) {
    this.pnr = `PNR${Math.floor(100000 + Math.random() * 900000)}`;
  }
  next();
});

// Populate user and train data when querying
bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate('train');
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);