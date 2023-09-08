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
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
})

mongoose.model('Expense', expenseSchema)