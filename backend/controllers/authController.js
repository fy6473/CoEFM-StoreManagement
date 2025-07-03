const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser =async(req,res)=>{
    try {

        const {name,position , user_id,mobile_no , password,role}= req.body;
        if(!name ||  !position || !user_id || !mobile_no || !password){
            return res.status(404).json({message:"plese provide all data"})
        }

        const existUser = await User.findOne({ user_id });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password,10);

        const user = await User.create({name,password:hashPassword,role,position,user_id,mobile_no});
        res.status(201).json({
            success:true,
            user,
            
       
        })
        
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }

}

const loginUser=async(req,res)=>{
    try {
        const {user_id,password}= req.body;
        if(!user_id || !password){
            return res.status(400).json({message:"Please provide all data"})
        }
        const user = await User.findOne({user_id})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const isMatch = await  bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h'     
        })
        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                role: user.role, // Make sure role is included
                // ...other fields
              }
                    });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
const logout = async(req,res)=>{}

module.exports={
    loginUser,
    registerUser,
    logout
}