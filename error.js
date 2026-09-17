const Transaction = require('./Schema/transaction')

class ApiError extends Error{
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}

class NotFoundError extends ApiError{
    constructor(message = 'Resource not found'){
        super(404, message);
    }
}

async function getTransactions(transactionId, userId){
    const transaction = await Transaction.findById(transactionId)

    if(!transaction){
        throw new NotFoundError('Transaction not found')
    }

    if(transaction.userId.toString() !== userId){
        throw new ApiError(403, "You are not authorized to access this Transaction!")
    }
    return transaction;
}

module.exports = {NotFoundError, ApiError, getTransactions}