const statusCodes = require('../config/statusCodes')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const x_api_key = req.headers['x-api-key']

        if (!x_api_key) {
            const err = new Error("x-api-key is missing")
            err.status_code = statusCodes.BAD_REQUEST
            return next(err)
        }

        if (x_api_key !== process.env.X_API_KEY) {
            const err = new Error("Unauthorized")
            err.status_code = statusCodes.UNAUTHORIZED
            return next(err)
        }

        if (req.baseUrl === "/users") {
           return next();
        }

        const authorized = req.headers['authorization']

        if (!authorized) {
            const err = new Error("Token is missing")
            err.status_code = statusCodes.BAD_REQUEST
            return next(err)
        }
        const token = authorized.split(" ")
        const decode = jwt.decode(token[1], process.env.JWT_SECRECT)
        if (!decode) {
            const err = new Error("Invalid Token")
            err.status_code = statusCodes.UNAUTHORIZED
            return next(err)
        }

        req.user = decode
        next();
    } catch (err) {
        next(err)
    }
}

module.exports = { auth }
