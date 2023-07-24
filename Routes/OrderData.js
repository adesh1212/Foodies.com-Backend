const express = require('express');
const router = express.Router();
const Orders = require('../models/Orders');

router.post('/checkout', async (req, res) => {
    let existing_user;
    const { email, data, date } = req.body;

    data.splice(0, 0, { date: date });

    try {
        existing_user = await Orders.findOne({ email });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured!Please try again",
            data: req.body
        })
    }

    if (!existing_user) {
        let order = new Orders({
            email: email,
            order_data: [data],
        })

        try {
            await order.save();
            return res.status(200).json({
                success: true,
                message: "Order placed successfully",
                data: order
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error occured!Please try again",
                data: req.body
            })
        }
    }
    else {
        let order_data = existing_user.order_data;
        const update = { order_data: [...order_data, data] };

        try {
            await Orders.findOneAndUpdate({ email }, update).then(() => {
                return res.status(200).json({
                    success: true,
                    message: "Order added successfully",
                    data: existing_user
                })
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error occured!Please try again"
            })
        }

    }
})

router.get('/getdata/:email',async(req,res)=>{
    const {email} = req.params;

    let user;
    try {
        user = await Orders.findOne({email});
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured!Please try again"
        })
    }

    if(!user){
        return res.status(200).json({
            success:true,
            data:[]
        })
    }

    return res.status(200).json({
        success:true,
        data:user.order_data
    })
})

module.exports = router;