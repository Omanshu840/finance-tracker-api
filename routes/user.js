const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Expense = mongoose.model("Expense")
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

router.get('/allUsers', requireLogin, async (request, response) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password field
        response.status(200).json({
            users
        });
    } catch(e) {
        response.status(500).json({
            error: "Error in fetching users"
        });
    }
})

router.get('/friends', requireLogin, async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all expenses where the user is a contributor or paidBy
        const expenses = await Expense.find({
            $or: [
                { 'contributors.user': userId },
                { paidBy: userId }
            ]
        });

        // Initialize an object to store balance amounts
        const balanceMap = {};
        const borrowedMap = {};
        const loanedMap = {};

        // Calculate balance amounts
        expenses.forEach(expense => {
            // Add to balance for contributors
            expense.contributors.forEach(contributor => {
                const contributorUserId = contributor.user.toString();
                const paidByUserId = expense.paidBy.toString();
                if (contributorUserId != userId && paidByUserId == userId) {
                    balanceMap[contributorUserId] = (balanceMap[contributorUserId] || 0) - contributor.amount;
                    loanedMap[contributorUserId] = (loanedMap[contributorUserId] || 0) + contributor.amount;
                }
                if(contributorUserId == userId && paidByUserId != userId) {
                    balanceMap[paidByUserId] = (balanceMap[paidByUserId] || 0) + contributor.amount;
                    borrowedMap[paidByUserId] = (borrowedMap[paidByUserId] || 0) + contributor.amount;
                }
            });
        });

        // Convert balance map to array of objects with userId and balance amount
        const friends = await Promise.all(Object.entries(balanceMap).map(async ([userId, balance]) => {
            const user = await User.findById(userId);
            return {
                userId,
                name: user.name,
                balance,
                loaned: (loanedMap[userId] || 0),
                borrowed: (borrowedMap[userId] || 0)
            };
        }));

        res.status(200).json({ friends });
    } catch (error) {
        console.error('Error fetching friends balance:', error);
        res.status(500).json({ error: 'Error in fetching friends balance' });
    }
});

module.exports = router