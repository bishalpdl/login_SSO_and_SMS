const sgMail = require('@sendgrid/mail')

async function emailer(userEmail, otp_string){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
    to: userEmail, // Change to your recipient
    from: 'bishal1paudel@outlook.com', // Change to your verified sender
    subject: 'OTP Message from Login Form',
    text: `The OTP code is ${otp_string}`,
    }
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error);
    })
}

module.exports = emailer;