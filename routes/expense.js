const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Expense = mongoose.model("Expense")
const User = mongoose.model("User")
const requireLogin = require('../middleware/requireLogin')


const formatDate = (date, isStart) => {
    date.setUTCDate(date.getUTCDate() + 1);
    date.setUTCHours(isStart ? 0 : 23);
    date.setUTCMinutes(isStart ? 0 : 59);
    date.setUTCSeconds(isStart ? 0 : 59);
    date.setUTCMilliseconds(isStart ? 0 : 999);
    return date;
}

router.post('/', requireLogin, async (req, res) => {
    const { name, amount, description, date, category, contributors, paidBy } = req.body;

    // Check if required fields are provided
    if (!name || !amount || !date || !category || !contributors || !paidBy) {
        return res.status(422).json({ error: "Please add all the required fields" });
    }

    const contributorsArray = [];
    for(let i = 0; i<contributors.length; i++) {
        const contributor = contributors[i];
        const contributorUser = await User.findById(contributor._id);
        contributorUser.password = undefined;
        contributorsArray.push({
            user: contributorUser,
            amount: contributor.amount
        })
    }

    const paidByUser = await User.findById(paidBy);
    paidByUser.password = undefined;

    // Create the expense object
    const expense = new Expense({
        name,
        amount,
        description,
        date,
        category,
        contributors: contributorsArray,
        paidBy: paidByUser
    });

    expense.save()
    .then((result) => {
        res.json({expense: result})
    })
    .catch((err) => {
        res.status(422).json({error: err})
    })
})

router.get('/', requireLogin, (req, res) => {
    const month = parseInt(req.query.month); // Extract month from query parameter and parse it to integer
    const year = parseInt(req.query.year); // Extract year from query parameter and parse it to integer

    // Validate month and year
    if (isNaN(month) || month < 0 || month > 11) {
        return res.status(400).json({ error: 'Invalid month value' });
    }

    if (isNaN(year) || year < 1000 || year > 9999) {
        return res.status(400).json({ error: 'Invalid year value' });
    }

    // Get the start and end date for the given month and year
    let startDate = formatDate(new Date(year, month, 1), true);
    let endDate = formatDate(new Date(year, month + 1, 0), false);

    const filterCriteria = {
        $and: [
            { date: { $gte: startDate, $lte: endDate } },
            { 'contributors.user': req.user } // Check if the user is a contributor
        ]
    };

    Expense.find(filterCriteria)
    .then(expenses => {
        res.json({
            expenses
        });
    })
    .catch(err => {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
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