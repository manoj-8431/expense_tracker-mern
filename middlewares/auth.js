const {ApiError} = require('../error')
const jwt = require('jsonwebtoken') 

const authenticate = async(req, res, next) => {
    try{
        const authHeaders = await req.headers.authorization;

        if(!authHeaders || !authHeaders.startsWith('Bearer ')){
            throw new ApiError(401, "No token provided")
        }

        const token = authHeaders.split(' ')[1]

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()
    }catch(err){
        if(err.name === "TokenExpiredError"){
            return next(new ApiError(401, "Token expired, Please login again"))
        }
        if(err.name === "JsonWebTokenError"){
            return next(new ApiError(401, "Invalid Token"))
        }
        next(err)
    }
}

module.exports = authenticate