const mongoose=require('mongoose')

const itemSchema = new mongoose.Schema({
    serial: { // <-- Add this
        type: String,
        required: true
      },
    itemname:{
        type: String,
        required: true,
        trim: true
    },
    quantity:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        
    },
    ledger:{
        type:String,

    }
},{ timestamps: true})

module.exports = mongoose.model('Item', itemSchema);