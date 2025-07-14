const express=require('express');
const {createItem,getItems,updateItem,deleteItem}=require('../controllers/itemsController');

const router=express.Router();

router.post('/create',createItem);
router.get('/get',getItems);
router.put('/update/:id',updateItem);
router.delete('/delete/:id',deleteItem);

module.exports=router;