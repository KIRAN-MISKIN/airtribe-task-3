const express = require('express')
const eventRouter = express.Router()
const { createEvent, updateEvent, deleteEvent, getEvents, getEventById, eventRegister,  } = require('../controller/events')

eventRouter.post('/', createEvent)
eventRouter.patch('/:_id', updateEvent)
eventRouter.delete('/:_id', deleteEvent)
eventRouter.get('/', getEvents)
eventRouter.get('/:_id', getEventById)
eventRouter.post('/:_id/register', eventRegister)


module.exports = eventRouter
