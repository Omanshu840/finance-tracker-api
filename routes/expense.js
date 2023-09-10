const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Expense = mongoose.model("Expense")
const requireLogin = require('../middleware/requireLogin')


router.post('/', requireLogin, (req, res) => {
    const {name, amount, description, date, category} = req.body
    if(!name || !amount || !date || !category) {
        return res.status(422).json({error: "please add all the fields"})
    }
    const expense = new Expense({
        name: name,
        amount: amount,
        description: description,
        date: date,
        category, category,
        user: req.user
    })

    expense.save()
    .then((result) => {
        res.json({expense: result})
    })
    .catch((err) => {
        res.status(422).json({error: err})
    })
})

router.get('/', requireLogin, (req, res) => {
    Expense.find({user: req.user})
    .then(expenses => {
        res.json({
            expenses
        })
    })
})

router.delete('/:id', requireLogin, (req, res) => {
    Expense.findOne({_id:req.params.id})
    .then((expense)=>{
        expense.remove()
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
    .catch(err => {
        return res.status(422).json({error:err})
    })
})

module.exports = router