export default {
    JWT: {
        tokenExpiresIn: '60m',
        refreshTokenExpiresIn: '24m',
    },
    SMTP: {
        service: 'gmail',
        user: 'personalforott@gmail.com',
        password: 'fawlcqlaoufssmuc'
    },
    email: {
        resetPassword: {
            subject: 'Password Reset',
            body: `You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it: \n\n http://localhost:3000/reset/{{resetPasswordToken}} \n\n token: {{resetPasswordToken}} \n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
        }
    }
}