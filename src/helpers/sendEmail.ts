import nodemailer from 'nodemailer';
import config from '../config/config';

const sendEmail = async ({ to, subject, body }: any) => {
    const transporter = nodemailer.createTransport({
        service: config.SMTP.service,
        auth: {
            user: config.SMTP.user,
            pass: config.SMTP.password,
        },
    });

    const mailOptions = {
        from: `Restaurant Search <${config.SMTP.user}>`,
        to,
        subject,
        text: body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('An error occurred while sending email:', err);
    }
}

export default sendEmail;