const { users, events, bookings } = require('../data/inMemoryStore')
const statusCode = require('../config/statusCodes')
const { createEventBodyValidation, updateEventBodyValidation } = require('../utils/validations')
const { eventIdGenerator, bookingId } = require('../utils/idGenerator')
const { responseHandler } = require('../utils/responseHandler')
const { eventEmitter } = require('../utils/eventEmitter')

const createEvent = async (req, res) => {
    try {
        const id = req.user.id
        const details = await users.find(user => user.id === id)
        if (details.role !== "admin") {
            const err = new Error("You do not have permission to create an event. Only administrators are allowed to perform this action.")
            err.status_code = statusCode.FORBIDDEN
            throw err
        }

        if (req.body === undefined) {
            const err = new Error("Request body cannot be empty")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }

        const isBodyValid = await createEventBodyValidation(req.body)
        if (!isBodyValid.status) {
            const err = new Error(isBodyValid.message)
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }
        const event = {
            id: eventIdGenerator(),
            event_name: req.body.event_name,
            description: req.body.description,
            date: req.body.date,
            time: req.body.time,
            location: req.body.location,
            createdBy: details.name,
            participants: []
        }
        events.push(event)
        return responseHandler(res, statusCode.SUCCESS, { message: "Event Created Successfully" })
    } catch (err) {
        throw err
    }
}

const updateEvent = async (req, res) => {
    try {
        const id = req.user.id
        const details = await users.find(user => user.id === id)
        if (details.role !== "admin") {
            const err = new Error("You do not have permission to create an event. Only administrators are allowed to perform this action.")
            err.status_code = statusCode.FORBIDDEN
            throw err
        }

        if (req.body === undefined) {
            const err = new Error("Request body cannot be empty")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }

        const isBodyValid = await updateEventBodyValidation(req.body)
        if (!isBodyValid.status) {
            const err = new Error(isBodyValid.message)
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }
        const { _id } = req.params
        if (!_id) {
            const err = new Error("Event ID is required")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }
        const event_details = await events.find(event => event.id === _id)
        if (event_details === undefined) {
            const err = new Error("No event found with this ID")
            err.status_code = statusCode.NOT_FOUND
            throw err
        }
        const index = await events.findIndex(event => event.id === _id)
        const updated_event = { ...event_details, ...req.body }
        events[index] = updated_event
        return responseHandler(res, statusCode.SUCCESS, { message: "Event Updated Successfully" })
    } catch (err) {
        throw err
    }
}

const deleteEvent = async (req, res) => {
    try {
        const id = req.user.id
        const details = await users.find(user => user.id === id)
        if (details.role !== "admin") {
            const err = new Error("You do not have permission to create an event. Only administrators are allowed to perform this action.")
            err.status_code = statusCode.FORBIDDEN
            throw err
        }

        if (req.body !== undefined) {
            const err = new Error("Request body should be empty")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }

        const { _id } = req.params
        if (!_id) {
            const err = new Error("Event ID is required")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }
        const event_details = await events.find(event => event.id === _id)
        if (event_details === undefined) {
            const err = new Error("No event found with this ID")
            err.status_code = statusCode.NOT_FOUND
            throw err
        }

        const index = await events.findIndex(event => event.id === _id)
        events.splice(index, 1)
        return responseHandler(res, statusCode.SUCCESS, { message: "Event Deleted Successfully" })
    } catch (err) {
        throw err
    }
}

const getEvents = async (req, res) => {
    try {
        const id = req.user.id
        const details = await users.find(user => user.id === id)
        if (details.role !== "admin") {
            const err = new Error("You do not have permission to create an event. Only administrators are allowed to perform this action.")
            err.status_code = statusCode.FORBIDDEN
            throw err
        }

        if (req.body !== undefined) {
            const err = new Error("Request body should be empty")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }

        if (events.length === 0) {
            const err = new Error("No events available")
            err.status_code = statusCode.NOT_FOUND
            throw err
        }
        return responseHandler(res, statusCode.SUCCESS, { events: events })
    } catch (err) {
        throw err
    }
}

const getEventById = async (req, res) => {
    try {
        const id = req.user.id
        const details = await users.find(user => user.id === id)
        if (details.role !== "admin") {
            const err = new Error("You do not have permission to create an event. Only administrators are allowed to perform this action.")
            err.status_code = statusCode.FORBIDDEN
            throw err
        }
        const { _id } = req.params
        if (!_id) {
            const err = new Error("Event ID is required")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }

        if (req.body !== undefined) {
            const err = new Error("Request body should be empty")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }

        const event_details = await events.find(event => event.id === _id)
        if (event_details === undefined) {
            const err = new Error("No event found with this ID")
            err.status_code = statusCode.NOT_FOUND
            throw err
        }
        return responseHandler(res, statusCode.SUCCESS, { event: event_details })
    } catch (err) {
        throw err
    }
}

const eventRegister = async (req, res) => {
    try {
        const id = req.user.id
        const details = await users.find(user => user.id === id)
        const { _id } = req.params
        if (!_id) {
            const err = new Error("Event ID is required")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }
        const event_details = await events.find(event => event.id === _id)
        if (event_details === undefined) {
            const err = new Error("No event found with this ID")
            err.status_code = statusCode.NOT_FOUND
            throw err
        }
        if (event_details.participants.includes(details.email)) {
            const err = new Error("You have already registered for this event")
            err.status_code = statusCode.BAD_REQUEST
            throw err
        }
        event_details.participants.push(details.email)
        const booking_data = {
            id: bookingId(),
            event_id: _id,
            event_name: event_details.event_name,
            user_id: id,
            userName: details.name,
            email: details.email,
            date: event_details.date,
            time: event_details.time,
            location: event_details.location,
            status: "Booked"
        }
        bookings.push(booking_data)
        eventEmitter.emit('send_email', { email: details.email, event_id: _id, event_name: event_details.event_name, date: event_details.date, time: event_details.time, location: event_details.location, user_id: details.id, userName: details.name })
        return responseHandler(res, statusCode.SUCCESS, { message: "Event Registered Successfully" })
    } catch (err) {
        throw err
    }
}

module.exports = { createEvent, updateEvent, deleteEvent, getEvents, getEventById, eventRegister }
