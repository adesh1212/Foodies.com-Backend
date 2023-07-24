const express = require('express');
const router = express.Router();


router.get('/foodData',async(req,res)=>{
    try {
        res.send([global.food_items,global.food_category]);
    } catch (error) {
        console.error(error.message);
        res.send(error);   
    }
})


module.exports = router;