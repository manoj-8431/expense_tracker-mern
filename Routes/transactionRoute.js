const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Transaction = require('../Schema/transaction')
const authenticate = require('../middlewares/auth')
const {NotFoundError, getTransactions} = require('../error')

router.get('/', authenticate, async(req, res, next) => {
    try{
        const transaction = await Transaction.find({userId: req.user.id})
        if(!transaction){
            throw new NotFoundError('No transactions found')
        }

        res.status(200).json({
            success: true,
            data: transaction,
            message: "All transactions fetched",
        })
    }catch(err){
        next(err)
    }
})


router.get('/summary/balance', authenticate, async(req, res, next) => {
    try{
        const result = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }}
        ]);

        let income = 0;
        let expense = 0;

        result.forEach((entry) => {
            if(entry._id === 'income') income = entry.total;
            if(entry._id === 'expense') expense = entry.total;
        });

        const balance = income - expense;

        res.status(200).json({
            success: true,
            data: { income, expense, balance },
            message: "Balance calculated successfully",
        })
    }catch(err){
        next(err)
    }
})


router.get('/summary/category', authenticate, async(req, res, next) => {
    try{
        const result = await Transaction.aggregate([
            { $match: {
                userId: new mongoose.Types.ObjectId(req.user.id),
                type: 'expense'
            }},
            { $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }}
        ]);

        res.status(200).json({
            success: true,
            data: result,
            message: "Category breakdown calculated successfully",
        })
    }catch(err){
        next(err)
    }
})


router.get('/:id', authenticate, async(req, res, next) => {
    try{
        const transaction = await getTransactions(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            data: transaction,
            message: 'Transaction details retrieved'
        })
    }catch(err){
        next(err)
    }
})

router.post('/', authenticate, async(req, res, next) => {
    try{
       const {type, amount, category, title, payment_mode} = req.body;
       const transaction = await Transaction.create({
        type,
        amount,
        category,
        title,
        payment_mode,
        userId: req.user.id,
       })
       res.status(201).json({
        success: true, 
        data: transaction,
        message: "New Transaction created successfully"
       })
    }catch(err){
        next(err)
    }
})


router.put('/:id', authenticate, async(req, res, next) => {
    try{
        const transaction = await getTransactions(req.params.id, req.user.id)
        const {type, amount, category, title, payment_mode} = req.body;

        transaction.type = type ?? transaction.type,
        transaction.amount = amount ?? transaction.amount,
        transaction.category = category ?? transaction.category,
        transaction.title = title ?? transaction.title,
        transaction.payment_mode = payment_mode ?? transaction.payment_mode,
        
        await transaction.save()
        res.status(200).json({
            success: true,
            data: transaction,
            message: "Transaction updated successfully",
        })
    }catch(err){
        next(err)
    }
})

router.delete('/:id', authenticate, async(req, res, next) => {
    try{
        const transaction = await getTransactions(req.params.id, req.user.id)
        await Transaction.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success: true,
            data: transaction,
            message: "Transaction deleted successfully",
        })
    }catch(err){
        next(err)
    }
})

module.exports = router