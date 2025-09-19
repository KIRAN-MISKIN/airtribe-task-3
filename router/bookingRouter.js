const express = require('express')
const bookingRouter = express.Router()
const {getAllBookings,getBookingsById,updateBooking} = require('../controller/bookings')

bookingRouter.get('/', getAllBookings)
bookingRouter.get('/:booking_id', getBookingsById)
bookingRouter.put('/:booking_id/cancel', updateBooking)

module.exports = bookingRouter
