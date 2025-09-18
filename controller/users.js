const { responseHandler } = require("../utils/responseHandler")
const statusCodes = require('../config/statusCodes')
const { registerBodyValidation, loginBodyValidation } = require("../utils/validations")
const { users } = require('../data/inMemoryStore')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { userIdGenerator } = require("../utils/idGenerator")
const { assignRole } = require("../utils/assignRole")

const register = async (req, res) => {
    try {
        const isBodyValidation = await registerBodyValidation(req.body)
        if (!isBodyValidation.status) {
            const err = new Error(isBodyValidation.message)
            err.status_code = statusCodes.BAD_REQUEST
            throw err
        }

        const checking = await users.find(users => users.email === req.body.email)
        if (checking !== undefined) {
            const err = new Error("User already exists with this email")
            err.status_code = statusCodes.BAD_REQUEST
            throw err
        }
        const hashing = await bcrypt.hashSync(req.body.password,10)
        const rlbody = {
            id: userIdGenerator(),
            name: req.body.name,
            email: req.body.email,
            password: hashing,
            role: assignRole(req.body.email)
        }
        users.push(rlbody)
        return responseHandler(res, statusCodes.SUCCESS, { message: "User registered successfully" })
    } catch (err) {
        throw err
    }
}

const login = async (req, res) => {
    try {
        const isBodyValidation = await loginBodyValidation(req.body)
        if (!isBodyValidation.status) {
            const err = new Error(isBodyValidation.message)
            err.status_code = statusCodes.BAD_REQUEST
            throw err
        }
        const getDetails = users.find(users => users.email === req.body.email)
        if (getDetails === undefined) {
            const err = new Error("User does not exist with this email")
            err.status_code = statusCodes.BAD_REQUEST
            throw err
        }
        const payload = {email:req.body.email,id:getDetails.id}
        const isPasswordValid = await bcrypt.compare(req.body.password, getDetails.password)
        if (!isPasswordValid) {
            const err = new Error("Invalid password")
            err.status_code = statusCodes.BAD_REQUEST
            throw err
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
        return responseHandler(res, statusCodes.SUCCESS, {token: token })
    } catch (err) {
        throw err
    }
}

const deleteUser = async (req, res) => {
    try {

    } catch (err) {
        next(err)
    }
}

const update = async (req, res) => {
    try {

    } catch (err) {
        next(err)
    }
}

module.exports = { update, deleteUser, login, register }
