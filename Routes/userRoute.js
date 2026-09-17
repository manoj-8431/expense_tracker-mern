require('dotenv').config()
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../Schema/user')
const { ApiError, NotFoundError} = require('../error')
const authenticate = require('../middlewares/auth')
const FeedBack = require('../Schema/feedback')

router.post('/register', async(req, res, next) => {
    try{
        const {name, email, password} = req.body;

        const existingEmail = await User.findOne({email})
        if(existingEmail){
            throw new ApiError(409, "Invalid Email or Password")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({name, email, password: hashedPassword})
        res.status(201).json({
            success: true,
            data: {id: user._id, name: user.name, email: user.email},
            message: "User registered successfully",
        })
    }catch(err){
        next(err)
    }
})


router.post('/login', async(req, res, next) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user){
            throw new ApiError(401, "Invalid Email or Password")
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            throw new ApiError(401, "Invalid Email or Password")
        }

        const access_token = await jwt.sign(
            {id: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '24h'}
        )

        const refresh_token = await jwt.sign(
            {id: user._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '7d'}
        )

        res.status(200).json({
            success: true,
            data: {access_token, refresh_token},
            message: "Login Successful",
        })
    }catch(err){
        next(err)
    }
})

router.get('/profile', authenticate, async(req, res, next) => {
    try{
        const user = await User.findById(req.user.id).select('-password')

        if(!user){
            throw new NotFoundError('User not found')
        }
        res.status(200).json({
            success: true,
            data: user,
            message: 'User account fetched successfully'
        })
    }catch(err){
        next(err)
    }
})

router.post('/feedback', authenticate, async(req, res, next) => {
    try{
        const {feedback} = req.body
        const newFeedback = await FeedBack.create({
            feedback: feedback,
            userId: req.user.id,
        })
        res.status(201).json({
            success: true,
            data: newFeedback,
            message: "Feedback submitted successfully",
        })
    }catch(err){
        next(err)
    }
})

router.post('/refresh-token', async(req, res, next) => {
    try{
        const { refresh_token } = req.body;

        if(!refresh_token){
            throw new ApiError(401, "Refresh token required")
        }

        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)

        const access_token = jwt.sign(
            { id: decoded.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        )

        res.status(200).json({
            success: true,
            data: { access_token },
            message: "Access token refreshed successfully",
        })
    }catch(err){
        if(err.name === "TokenExpiredError"){
            return next(new ApiError(401, "Refresh token expired, please login again"))
        }
        if(err.name === "JsonWebTokenError"){
            return next(new ApiError(401, "Invalid refresh token"))
        }
        next(err)
    }
})

module.exports = router