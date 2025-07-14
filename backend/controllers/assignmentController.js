const Assignment = require('../models/assignmentModel');
const Item = require('../models/itemsModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('itemId')
      .populate('employeeId');
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    const { itemId, employeeId } = req.body;
    if (!itemId || !employeeId) {
      return res.status(400).json({ message: 'Item and employee are required' });
    }
    // Optionally, check if item is already assigned
    let assignment = await Assignment.create({ itemId, employeeId });
    assignment = await Assignment.findById(assignment._id).populate('itemId').populate('employeeId');
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Return an assigned item
const returnAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid assignment ID' });
    }
    let assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    assignment.status = 'returned';
    assignment.returnedDate = new Date();
    await assignment.save();
    assignment = await Assignment.findById(id).populate('itemId').populate('employeeId');
    res.status(200).json(assignment);
  } catch (error) {
    console.error('Error returning assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllAssignments,
  createAssignment,
  returnAssignment,
}; 