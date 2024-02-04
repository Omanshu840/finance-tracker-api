const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        enum : ["Household", "Food", "Groceries", "Shopping", "Travel", "Others"],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    contributors: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    paidBy: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})

mongoose.model('Expense', expenseSchema)