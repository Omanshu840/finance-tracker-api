const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const transactionSchema = new mongoose.Schema({
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
    dayOfRepeat: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Income", "Expense"],
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
})

mongoose.model('Transaction', transactionSchema)