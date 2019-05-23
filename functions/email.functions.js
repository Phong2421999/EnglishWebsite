const nodemailer = require('nodemailer');

module.exports.sendMailVerify = function(email, hash, password, res) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.ADMIN_EMAIL_USERNAME,
            pass: process.env.ADMIN_EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: 'AirPlaneTicket PhongDuy mailbox', // sender address
        to: email, // list of receivers
        subject: 'Verify mail from AirPlaneTicket PhongDuy website',
        html: '<p><b>Please click this link to verify your account:</b> http://localhost:' + process.env.PORT + '/auth/verify/' + hash + '</p>\n<i>Your password: </i>' + '<b>' + password + '</b>'
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            res.status(500).send(err);
    });

}

module.exports.sendMailForgotPassword = function(email, password, res) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.ADMIN_EMAIL_USERNAME,
            pass: process.env.ADMIN_EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: 'AirPlaneTicket PhongDuy mailbox', // sender address
        to: email, // list of receivers
        subject: 'Respone your reset password request from AirPlaneTicket PhongDuy website', // Subject line
        html: '<p><b>Your new password: </b>' + password + '</p>\n<b>You can change your password after you have logined</b>' // plain text body
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            res.status(500).send(err);
    });

}