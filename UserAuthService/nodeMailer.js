const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth:{
        user: "geraldlouisjnr8@example.com",
        pass: '426759813'
    }
})

const mailOptions = {
    from: transporter.options.auth.user,
    to: email,
    subject: 'Password Reset',
    text: 'Hello from MealApp! This is a password reset link. Kindly follow the link to change your password. If you didnt request for this, please ignore',
}

module.exports = {transporter, mailOptions}