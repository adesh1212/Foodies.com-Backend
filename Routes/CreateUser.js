const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = "Secretkeyauthkey";


router.post('/signup',
    body('email', "Invalid email").isEmail(),
    body('name', "Name cannot be of one character").isLength({ min: 2 }),
    body('password', "Password must contain at least 5 characters").isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Enter valid credentials"
            });
        }

        const { name, location, email, password } = req.body;
        let existing_user;
        try {
            existing_user = await User.findOne({ email });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error occured!Please try again"
            })
        }
        if (existing_user) {
            return res.status(500).json({
                success: false,
                message: "User already exist!Login instead"
            })
        }
        const hashed_pass = bcrypt.hashSync(password);
        const newUser = new User({
            name,
            location,
            email,
            password: hashed_pass
        })

        try {
            await newUser.save();
            return res.status(200).json({
                success: true,
                message: "Signed in successfully"
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error occured!Please try again"
            })
        }
    })


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let existing_user;
    try {
        existing_user = await User.findOne({ email });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occured!Please try again"
        })
    }

    if (!existing_user) {
        return res.status(404).json({
            success: false,
            message: "Email does not exist"
        })
    }

    const isPassCorrect = bcrypt.compareSync(password, existing_user.password);
    if (!isPassCorrect) {
        return res.status(400).json({
            success: false,
            message: "Incorrect Password"
        })
    }

    const data = {
        user: {
            id: existing_user.id
        }
    }

    const authtoken = jwt.sign(data, jwtSecret)
    return res.status(200).json({
        success: true,
        authToken: authtoken
    })
})

module.exports = router;
