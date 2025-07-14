const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleBaseMiddleware');
const { getAllUsers, updateUser, deleteUser, getEmployeeProfile } = require('../controllers/userConroller');
const router = express.Router();

// only admin can access this router 
router.get('/admin',verifyToken, authorizeRoles("admin"), (req,res)=>{
    res.status(200).json({message:"Welcome Admin"});
})
// all can access this route 
router.get('/employee',verifyToken,authorizeRoles("admin","employee"),(req,res)=>{
    res.status(200).json({message:"Welcome User"});
}).get('/users',getAllUsers);

// Update and delete user routes
router.put('/update/:id', verifyToken, authorizeRoles("admin"), updateUser);
router.delete('/delete/:id', verifyToken, authorizeRoles("admin"), deleteUser);

// Employee profile route
router.get('/employee/profile', verifyToken, getEmployeeProfile);

module.exports = router;