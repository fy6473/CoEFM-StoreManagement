const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    position:{
        type: String,
        required: true,
        trim: true
    },
    user_id:{
        type: String,
        required: true,
        unique: true,
    },
    mobile_no:{
        type:Number,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum: ['admin','employee'],
        default: 'employee'
    },
},{
    timestamps: true})

    module.exports = mongoose.model('User',userSchema);