const nodemailer = require('nodemailer');

const sendEmails = async (email, subject = null, text = null) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST_MAILTRAP,
            port: process.env.PORT_MAILTRAP,
            secure: false,
            auth: {
                user: process.env.USERNAME_MAILTRAP,
                pass: process.env.PASSWORD_MAILTRAP,
            },
            tls: {
                rejectUnauthorized: false, // Set to true for stricter security (recommended)
            },
        });

        const mailOptions = {
            from: 'desyugo@hotmail.com', // `${process.env.USERNAME_MAILTRAP}@inbox.mailtrap.io`,
            to: email,
            subject: subject,
            text: text
        };
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(error, '-*error');
    }
}

module.exports = sendEmails; 