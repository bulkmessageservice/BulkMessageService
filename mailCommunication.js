var nodemailer = require('nodemailer');

var mongoose = require('mongoose');


module.exports = {
    customerEmail: function(data, callback) {
        var emailTraporter;
        if (data.smtpService == 'Other') {
            emailTraporter = nodemailer.createTransport({
                host: data.smtpHost,
                port: data.port,
                auth: {
                    user: data.username,
                    pass: data.password
                },
                tls: { rejectUnauthorized: false },
                debug: true
            });
        } else {
            if (data.authentication == 'OAuth') {
                emailTraporter = nodemailer.createTransport({
                    service: data.smtpService,
                    auth: {
                        type: 'OAuth2',
                        user: data.username,
                        clientId: data.clientId,
                        clientSecret: data.clientSecret,
                        refreshToken: data.refreshToken,
                        accessToken: data.accessToken
                    }
                });
            } else {
                emailTraporter = nodemailer.createTransport({
                    service: data.smtpService,
                    auth: {
                        user: data.username,
                        pass: data.password
                    }

                });
            }
        }
        callback(emailTraporter);
    },
    sendEmail: function(data, emailTraporter, sender, callback) {
        var mailOptions = {
            from: sender.senderName + '<' + sender.username + '>',
            to: data.recipient,
            subject: data.subject,
            html: data.html,
            attachments: data.attachment,
            replyTo: sender.replyTo,
            cc: sender.cc,
            bcc: sender.bcc
        };
        emailTraporter.sendMail(mailOptions, function(error, info) {
            callback(error, info);
        });
    }
};