const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config();
const { requestResponseLogger } = require('./middleware/requestResponseLogger')
const {logger} = require('./middleware/logs');
const { errorHandler } = require('./middleware/errorHandler');
const { auth } = require('./middleware/auth');
const { userRouter } = require('./router/userRouter');
const eventRouter = require('./router/eventRouter');
const app = express();
const helmet = require('helmet')
const { generalLimiter} = require("./middleware/rateLimiter");
const bookingRouter = require('./router/bookingRouter');
require('./utils/eventCatcher')

app.use(helmet())
app.use(express.json())
app.use(cors({ origin: `http://localhost:${process.env.PORT}`}))
app.use(requestResponseLogger);
app.use(generalLimiter);

app.use('/users', auth, userRouter)
app.use('/events', auth, eventRouter)
app.use('/bookings', auth, bookingRouter)

app.use(errorHandler)

module.exports = app;
