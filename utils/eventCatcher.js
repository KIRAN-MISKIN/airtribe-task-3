const { eventEmitter } = require('./eventEmitter')
const nodemailer = require('nodemailer')
const {bookings} = require('../data/inMemoryStore')
const {bookingId} = require('../utils/idGenerator')

const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

eventEmitter.on('send_email', (event) => {
    const booking_data = {
        id: bookingId(),
        event_id: event.event_id,
        event_name: event.event_name,
        user_id: event.user_id,
        userName,
        email: event.email,
        date: event.date,
        time: event.time,
        location: event.location
    }
    bookings.push(booking_data)

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.email,
        subject: `🎟️ Booking Confirmed: ${event.event_name}`,
        html: `<div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hi ${event.userName},</h2>
        <p>Thank you for registering for <strong>${event.event_name}</strong> 🎉</p>
        <p>Here are your event details:</p>
        
        <ul>
          <li><strong>Date:</strong> ${event.date}</li>
          <li><strong>Location:</strong> ${event.location}</li>
        </ul>
        
        <p>We look forward to seeing you at the event!</p>
        <p>— The Event Managemant Team 🚀</p>
      </div>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });

});

eventEmitter.on('Canceled Event', (booking) => {
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: `❌ Booking Canceled: ${booking.event_name}`,
        html: `<div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hi ${booking.userName},</h2>
        <p>Your booking for <strong>${booking.event_name}</strong> has been canceled. We're sorry to see you go.</p>
        <p>If you have any questions or need further assistance, please feel free to contact us.</p>
        <p>— The Event Management Team 🚀</p
        </div>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
});
