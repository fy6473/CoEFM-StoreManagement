const express = require('express');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors')

const port = process.env.PORT || 5050

// database connection 
connectDB();

// middleware 
app.use(express.json());
app.use(cors(
    {origin:"http://localhost:5173",
        credentials:true
    }
))



// routes 
app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)

// start server 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})