const express = require('express');
const { getAllAssignments, createAssignment, returnAssignment } = require('../controllers/assignmentController');
const router = express.Router();

// Get all assignments
router.get('/', getAllAssignments);
// Create a new assignment
router.post('/', createAssignment);
// Return an assigned item
router.put('/return/:id', returnAssignment);

module.exports = router; 