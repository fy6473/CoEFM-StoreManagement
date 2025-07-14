const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  returnedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['assigned', 'returned'],
    default: 'assigned',
    required: true
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema); 