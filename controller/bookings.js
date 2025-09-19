const { bookings } = require('../data/inMemoryStore')
const statusCodes = require('../config/statusCodes')
const { responseHandler } = require('../utils/responseHandler')
const { eventEmitter } = require('../utils/eventEmitter')

const getAllBookings = async (req, res) => {
    try {
        const { id } = req.user
        const userBookings = bookings.filter(booking => booking.user_id === id)
        if (userBookings.length === 0) {
            const err = new Error("No Bookings found")
            err.status_code = statusCodes.BAD_REQUEST
            throw err
        }
        return responseHandler(res, statusCodes.SUCCESS, { events: userBookings })
    } catch (err) {
        throw err
    }
}

const getBookingsById = async (req, res) => {
    try {
        const { id } = req.user
        const {booking_id} = req.params
        const userBookings = bookings.filter(booking => booking.user_id === id && booking.id === booking_id)
        if (userBookings.length === 0) {
            const err = new Error("No Bookings found")
            err.status_code = statusCodes.BAD_REQUEST
            throw err
        }
        return responseHandler(res, statusCodes.SUCCESS, { events: userBookings })
    } catch (err) {
        throw err
    }
}

const updateBooking = async (req, res) => {
    try {
        const {id} = req.user
        const {booking_id} = req.params
        const bookingIndex = bookings.findIndex(booking => booking.user_id === id && booking.id === booking_id)
        if (bookingIndex === -1) {
            const err = new Error("No Bookings found")
            err.status_code = statusCodes.BAD_REQUEST
            throw err
        }
        bookings[bookingIndex].status = "Canceled"
        eventEmitter.emit('Canceled Event', bookings[bookingIndex])
        return responseHandler(res, statusCodes.SUCCESS, { message: "Booking Canceled Successfully" })
    } catch (err) {
        throw err
    }
}

module.exports = { getAllBookings, getBookingsById, updateBooking }