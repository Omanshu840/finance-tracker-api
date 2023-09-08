const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const requireLogin = require('../middleware/requireLogin')


router.get('/', requireLogin, async (request, response) => {
    try {
        const user = await User.findById(request.user._id);
        user.password = undefined;
        response.status(200).json({
            user
        });
    } catch(e) {
        response.status(500).json({
            error: "Error in Fetching user"
        })
    }
})

module.exports = router