const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config')


router.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    if(!email || !password || !name) {
        return res.status(422).json({error: "please add all the fields"})
    }
    User.findOne({email: email})
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json({error: "Email already registered"})
        }

        bcrypt.hash(password, 12)
        .then((hashedpassword) => {
            const user = new User({
                email, 
                password: hashedpassword, 
                name,
            })
    
            user.save()
            .then((newUser) => {
                const token = jwt.sign({_id: newUser._id}, JWT_SECRET)

                const {_id, name, email} = newUser

                res.json({
                    token: token,
                    user: {_id, name, email}
                })
            })
            .catch((err) => {
                console.log(err)
            })
        })
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(422).json({error: "please fill the required fields"})
    }
    User.findOne({email: email})
    .then((savedUser) => {
        if(!savedUser) {
            return res.status(422).json({error: "Email is not registered"})
        }
        bcrypt.compare(password, savedUser.password)
        .then((isMatched) => {
            if(isMatched) {
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)

                const {_id, name, email} = savedUser

                res.json({
                    token: token,
                    user: {_id, name, email}
                })
            }
            else {
                return res.status(422).json({error: "Invalid Email or Password"})
            }
        })
        .catch((err) => {
            console.log(err)
        })
    })
})

module.exports = router