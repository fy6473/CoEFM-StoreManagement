const mongoose = require('mongoose');
const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const Item = require('../models/itemsModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateUser = async(req,res)=>{
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        let user = await User.findById(id);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        user = await User.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteUser = async(req,res)=>{
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        await User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get employee profile and assignments
const getEmployeeProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const employee = await User.findById(userId).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Find assignments for this employee, populate item details
        const assignments = await Assignment.find({ employeeId: userId })
            .populate('itemId')
            .sort({ assignedDate: -1 });
        res.json({
            employee,
            assignments
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getEmployeeProfile
};