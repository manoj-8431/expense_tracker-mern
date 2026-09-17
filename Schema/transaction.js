const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    payment_mode: {
        type: String,
        enum: ['Cash', 'Card', 'UPI'],
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction