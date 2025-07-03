const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleBaseMiddleware');
const router = express.Router();

// only admin can access this router 
router.get('/admin',verifyToken, authorizeRoles("admin"), (req,res)=>{
    res.status(200).json({message:"Welcome Admin"});
})
// all can access this route 
router.get('/employee',verifyToken,authorizeRoles("admin","employee"),(req,res)=>{
    res.status(200).json({message:"Welcome User"});
})

module.exports = router;