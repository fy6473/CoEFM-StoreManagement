const Item = require("../models/itemsModel");


const createItem=async(req,res)=>{

    try {
        const {itemname,price,quantity,serial,ledger}=req.body;

        if(!itemname||!quantity){
            return res.status(404).json({
                message:'All fields are require'
            });
        }
         // Get the latest serial number (if any)
    

        const item= await Item.create({ itemname, price, quantity,serial,ledger });
        res.status(201).json({
                success:true,
                item,
            })
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

const getItems= async(req,res)=>{
    try {
        const items= await Item.find();
        res.status(200).json({
            success:true,
            items,
        })
    } catch (error) {
        console.error("Error in getting items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateItem=async(req,res)=>{
    try {
        const {id}=req.params;
        const {itemname,price,quantity,ledger,serial}=req.body;
        const item=await Item.findByIdAndUpdate(id,{itemname,price,quantity,ledger,serial},{new:true});
        res.status(200).json({
            success:true,
            item,
        })
    } catch (error) {
        console.error("Error in updating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteItem=async(req,res)=>{
    try {
        const {id}=req.params;
        const item=await Item.findByIdAndDelete(id);
        res.status(200).json({
            success:true,
            item,
        })
    } catch (error) {
        console.error("Error in deleting item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

  
module.exports={createItem,
    getItems,
    updateItem,
    deleteItem,
}