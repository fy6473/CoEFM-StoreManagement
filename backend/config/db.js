const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connectDB= async ()=>{
    try {
        const connect = await mongoose.connect(process.env.DB_URL)
        console.log(`MongoDB connected: ${connect.connection.host} , ${connect.connection.name}`);
        
        
    } catch (error) {
        console.log("connection Failled : "   + error.message);
        
    }
}

module.exports = connectDB;
