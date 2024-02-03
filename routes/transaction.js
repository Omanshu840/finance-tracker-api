const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Transaction = mongoose.model("Transaction")
const requireLogin = require('../middleware/requireLogin')


router.post('/', requireLogin, (req, res) => {
    const {name, amount, description, dayOfRepeat, category, type} = req.body
    if(!name || !amount || !dayOfRepeat || !category || !type) {
        return res.status(422).json({error: "please add all the fields"})
    }
    const transaction = new Transaction({
        name: name,
        amount: amount,
        description: description,
        dayOfRepeat: dayOfRepeat,
        type: type,
        category, category,
        user: req.user
    })

    transaction.save()
    .then((result) => {
        res.json({transaction: result})
    })
    .catch((err) => {
        res.status(422).json({error: err})
    })
})

module.exports = router