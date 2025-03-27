const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'A train must have a number'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'A train must have a name']
  },
  source: {
    type: String,
    required: [true, 'A train must have a source station']
  },
  destination: {
    type: String,
    required: [true, 'A train must have a destination station']
  },
  departureTime: {
    type: String,
    required: [true, 'A train must have a departure time']
  },
  arrivalTime: {
    type: String,
    required: [true, 'A train must have an arrival time']
  },
  distance: {
    type: Number,
    required: [true, 'A train must have distance']
  },
  seats: {
    sleeper: {
      total: Number,
      booked: {
        type: Number,
        default: 0
      },
      price: Number
    },
    ac: {
      total: Number,
      booked: {
        type: Number,
        default: 0
      },
      price: Number
    }
  },
  runningDays: [{
    type: String,
    enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }]
}, {
  timestamps: true
});

// Indexes for faster search
trainSchema.index({ source: 1, destination: 1 });

module.exports = mongoose.model('Train', trainSchema);