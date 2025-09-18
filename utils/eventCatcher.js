const { eventEmitter } = require('./eventEmitter')
const nodemailer = require('nodemailer')


eventEmitter.on('send_email', (event) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });

});
