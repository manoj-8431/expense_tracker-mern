const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedBackSchema = new Schema({
    feedback: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

const Feedback = mongoose.model('Feedback', feedBackSchema)
module.exports = Feedback