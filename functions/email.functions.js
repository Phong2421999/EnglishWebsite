const nodemailer = require('nodemailer');

module.exports.sendMailVerify = function(email, hash, res) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.ADMIN_EMAIL_USERNAME,
            pass: process.env.ADMIN_EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: 'PhongA mailbox', // sender address
        to: email, // list of receivers
        subject: 'Verify mail from PhongA website', // Subject line
        html: '<p>Please click this link to verify your account: http://localhost:3000/auth/verify/' + hash + '</p>' // plain text body
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            res.status(500).send(err);
    });

}

module.exports.sendMailForgotPassword = function(email, hash, res) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.ADMIN_EMAIL_USERNAME,
            pass: process.env.ADMIN_EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: 'PhongA mailbox', // sender address
        to: email, // list of receivers
        subject: 'Respone your reset password request from PhongA website', // Subject line
        html: '<p>Please click this link to reset your password: http://localhost:3000/auth/forgotpassword/' + hash + '</p>' // plain text body
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            res.status(500).send(err);
    });

}