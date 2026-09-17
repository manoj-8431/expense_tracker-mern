require("dotenv").config();
require('./config/dbConnections')

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const transactionRoute = require('./Routes/transactionRoute')
const userRoute = require('./Routes/userRoute')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(cors(''))

app.use('/transaction', transactionRoute)
app.use('/user', userRoute)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Something went wrong on Server Side'

    res.status(statusCode).json({
        success: false,
        data: null,
        message: message
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App running on PORT: ${PORT}`)
})