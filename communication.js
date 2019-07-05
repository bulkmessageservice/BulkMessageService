// var request = require('request');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'bms.services06@gmail.com',
        pass: 'bms12345'
    }
}));

module.exports = {
    sendEmail: function(data, callback) {
        var mailOptions = {
            from: 'bms.services06@gmail.com',
            to: data.recipient,
            subject: data.subject,
            html: data.html
        };
        transporter.sendMail(mailOptions, function(error, info) {
            callback(error, info);
        });
    }
}