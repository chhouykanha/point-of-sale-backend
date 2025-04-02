const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
    try {
        if(!req.body.password){
            return res.status(400).json({error: 'password is required'})
        }

        // Check if the user is attempting to create an admin
        if (req.user.role !== "super" && req.body.role === "admin") {
            return res.status(403).json({ error: 'Only super users can create admin accounts' });
        }

        const hashed = await bcrypt.hash(req.body.password, 10)
        const doc = await UserModel.create({...req.body, password: hashed})
        
        res.status(201).json({
            success: true,
            result: doc
        })
    } catch (error) {
        next(error)
    }
}

exports.signin = async (req, res, next) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({error: 'email and password is required'})
        }
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(401).json({error: 'Unauthorization'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({error: 'Password does not match!'})
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRE
        })

        res.cookie('token', token, {
            httpOnly: process.env.COOKIE_HTTPONLY.toLocaleLowerCase() == "true",
            secure: process.env.ENV == "production",
            maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
            domain: process.env.ENV == "production" ? process.env.DOMAIN : "",
            sameSite: process.env.DOMAIN_SAMESITE
        })

        res.status(200).json({
            success: true,
            result: {
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.signout = async (req, res, next) => {
    try {
        if(!req.user){
            return res.status(401).json({error: 'Unauthorization'})
        }

        res.clearCookie('token',{
            httpOnly: process.env.COOKIE_HTTPONLY.toLocaleLowerCase() == "true",
            secure: process.env.ENV == "production",
            maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
            domain: process.env.ENV == "production" ? process.env.DOMAIN : "",
            sameSite: process.env.DOMAIN_SAMESITE
        })

        res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

exports.current = async (req, res, next) => {
    try {
        if(!req.user){
            return res.status(401).json({error: 'Unauthorization'})
        }
    
        res.status(200).json({
            success: true,
            result: req.user
        })
    } catch (error) {
        next(error)
    }
}
