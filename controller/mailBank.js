var mongoose = require('mongoose');
require('../model/mailConfigurationModel');
require('../model/emailLogsModel');
var mailConfigurationModel = mongoose.model('mailConfigurationModel');
var emailLogsModel = mongoose.model('emailLogsModel');

var randomstring = require('randomstring');
var fs = require('fs');
var waterfall = require('async-waterfall');
var ejs = require('ejs');
var path = require('path');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
var xlsxtojson = require("xlsx-to-json");
var secret_key = 'SRCEukzwWJybZkUpHVdA5PtdkFvWPmddyUwtb2';

var mailCommunication = require('../mailCommunication');




exports.saveMailSetup = function(req, res) {
    var emailSetObject;
    var emailUnsetObject;

    if (req.body.smtpService == "Other") {
        emailSetObject = {
            userId: req.decoded._id,
            authentication: req.body.authentication,
            email: req.body.email,
            senderName: req.body.senderName,
            smtpService: req.body.smtpService,
            successfullyConfigured: 'false',
            username: req.body.username,
            smtpHost: req.body.smtpHost,
            port: req.body.port,
            password: req.body.password
        };

        emailUnsetObject = {
            accessToken: "",
            clientId: "",
            clientSecret: "",
            refreshToken: ""
        };

        if (req.body.replyTo) {
            emailSetObject.replyTo = req.body.replyTo;
        } else {
            emailUnsetObject.replyTo = "";
        }

        if (req.body.cc) {
            emailSetObject.cc = req.body.cc;
        } else {
            emailUnsetObject.cc = "";
        }

        if (req.body.bcc) {
            emailSetObject.bcc = req.body.bcc;
        } else {
            emailUnsetObject.bcc = "";
        }
    } else {
        if (req.body.authentication == 'OAuth') {
            emailSetObject = {
                authentication: req.body.authentication,
                email: req.body.email,
                senderName: req.body.senderName,
                smtpService: req.body.smtpService,
                successfullyConfigured: 'false',
                username: req.body.username,
                accessToken: req.body.accessToken,
                clientId: req.body.clientId,
                clientSecret: req.body.clientSecret,
                refreshToken: req.body.refreshToken,
            };

            emailUnsetObject = {
                password: "",
                host: "",
                port: ""
            };


            if (req.body.replyTo) {
                emailSetObject.replyTo = req.body.replyTo;
            } else {
                emailUnsetObject.replyTo = "";
            }

            if (req.body.cc) {
                emailSetObject.cc = req.body.cc;
            } else {
                emailUnsetObject.cc = "";
            }

            if (req.body.bcc) {
                emailSetObject.bcc = req.body.bcc;
            } else {
                emailUnsetObject.bcc = "";
            }

        } else {
            emailSetObject = {
                authentication: req.body.authentication,
                email: req.body.email,
                senderName: req.body.senderName,
                smtpService: req.body.smtpService,
                successfullyConfigured: 'false',
                password: req.body.password,
                username: req.body.username
            };

            emailUnsetObject = {
                accessToken: "",
                clientId: "",
                clientSecret: "",
                refreshToken: "",
                host: "",
                port: ""
            };

            if (req.body.replyTo) {
                emailSetObject.replyTo = req.body.replyTo;
            } else {
                emailUnsetObject.replyTo = "";
            }

            if (req.body.cc) {
                emailSetObject.cc = req.body.cc;
            } else {
                emailUnsetObject.cc = "";
            }

            if (req.body.bcc) {
                emailSetObject.bcc = req.body.bcc;
            } else {
                emailUnsetObject.bcc = "";
            }
        }
    }

    mailConfigurationModel.updateOne({}, { $set: emailSetObject, $unset: emailUnsetObject }, { upsert: true }, function(err, result) {
        res.status(201).json({ title: 'Successfully saved', message: 'Email settings has been successfully saved' });
    });
}


exports.getMailConfigrationData = function(req, res) {

    mailConfigurationModel.findOne({}, {
        replyTo: 1,
        cc: 1,
        bcc: 1,
        senderName: 1,
        email: 1,
        smtpHost: 1,
        port: 1,
        authentication: 1,
        password: 1,
        username: 1,
        clientId: 1,
        clientSecret: 1,
        refreshToken: 1,
        accessToken: 1,
        smtpService: 1,
        successfullyConfigured: 1
    }, function(err, result) {

        res.status(201).json({ emailSetup: result });
    });
}
exports.sendTestMail = function(req, res) {
    waterfall([
        function(callback) {
            mailConfigurationModel.findOne({}, {
                replyTo: 1,
                cc: 1,
                bcc: 1,
                senderName: 1,
                email: 1,
                smtpHost: 1,
                port: 1,
                authentication: 1,
                password: 1,
                username: 1,
                clientId: 1,
                clientSecret: 1,
                refreshToken: 1,
                accessToken: 1,
                smtpService: 1,
                customerId: 1,
                customerObjectId: 1
            }, function(err, result) {
                callback(null, result);
            });
        },
        function(emailData, callback) {
            mailCommunication.customerEmail(emailData, function(result) {
                callback(null, emailData, result);
            });
        },
        function(sender, emailTraporter, callback) {
            var mailOptions = {
                recipient: req.body.email,
                subject: req.body.subject,
                html: req.body.content
            };
            mailCommunication.sendEmail(mailOptions, emailTraporter, sender, function(emailErr, emailResult) {
                var emailLogObj;
                if (emailErr) {
                    emailLogObj = {
                        sender: sender.username,
                        to: req.body.email,
                        subject: req.body.subject,
                        body: req.body.content,
                        emailStatus: 'Failed',
                        statusDetails: [emailErr]
                    };
                    callback(null, false, emailLogObj, emailErr);

                } else {
                    emailLogObj = {
                        sender: sender.username,
                        to: req.body.email,
                        subject: req.body.subject,
                        body: req.body.content,
                        emailStatus: 'Succeeded',
                        statusDetails: [emailResult]
                    };
                    callback(null, true, emailLogObj, emailResult);
                }
            });
        }
    ], function(err, emailSent, emailLogObj, emailResult) {
        if (emailSent) {
            emailLogObj.created_by = req.decoded._id;
            var mailLogObj = new emailLogsModel(emailLogObj);
            mailLogObj.save(function(err, result) {});
            mailConfigurationModel.updateOne({}, {
                $set: {
                    successfullyConfigured: "true"
                }
            }, { upsert: true }, function(err, result) {});
            res.status(200).json({ message: emailResult });
        } else {
            var mailLogObj = new emailLogsModel(emailLogObj);
            mailLogObj.save(function(err, result) {});
            res.status(524).json({ message: emailResult });
        }
    });
}


exports.getLogList = function(req, res) {
    emailLogsModel.find({ created_by: req.decoded._id }, function(err, result) {
        res.status(200).json({ result: result });
    })
}


exports.saveSendMailData = function(req, res) {
    waterfall([
        function(callback) {
            mailConfigurationModel.findOne({}, {
                replyTo: 1,
                cc: 1,
                bcc: 1,
                senderName: 1,
                email: 1,
                smtpHost: 1,
                port: 1,
                authentication: 1,
                password: 1,
                username: 1,
                clientId: 1,
                clientSecret: 1,
                refreshToken: 1,
                accessToken: 1,
                smtpService: 1,
                customerId: 1,
                customerObjectId: 1
            }, function(err, result) {
                callback(null, result);
            });
        },
        function(emailData, callback) {
            mailCommunication.customerEmail(emailData, function(result) {
                callback(null, emailData, result);
            });
        },
        function(sender, emailTraporter, callback) {
            var mailOptions = {
                recipient: req.body.email,
                subject: req.body.subject,
                html: req.body.content
            };
            mailCommunication.sendEmail(mailOptions, emailTraporter, sender, function(emailErr, emailResult) {
                var emailLogObj;
                if (emailErr) {
                    emailLogObj = {
                        sender: sender.username,
                        to: req.body.email,
                        subject: req.body.subject,
                        body: req.body.content,
                        emailStatus: 'Failed',
                        statusDetails: [emailErr]
                    };
                    callback(null, false, emailLogObj, emailErr);

                } else {
                    emailLogObj = {
                        sender: sender.username,
                        to: req.body.email,
                        subject: req.body.subject,
                        body: req.body.content,
                        emailStatus: 'Succeeded',
                        statusDetails: [emailResult]
                    };
                    callback(null, true, emailLogObj, emailResult);
                }
            });
        }
    ], function(err, emailSent, emailLogObj, emailResult) {
        if (emailSent) {
            emailLogObj.created_by = req.decoded._id;
            var mailLogObj = new emailLogsModel(emailLogObj);
            mailLogObj.save(function(err, result) {});
            mailConfigurationModel.updateOne({}, {
                $set: {
                    successfullyConfigured: "true"
                }
            }, { upsert: true }, function(err, result) {});
            res.status(200).json({ message: emailResult });
        } else {
            var mailLogObj = new emailLogsModel(emailLogObj);
            mailLogObj.save(function(err, result) {});
            res.status(524).json({ message: emailResult });
        }
    });
}

exports.uploadExcel = function(req, res) {
    waterfall([
        function(callback) {
            xlsxtojson({
                input: req.files.excelFile.path,
                output: null,
                lowerCaseHeaders: false
            }, function(err, result) {
                callback(null, result);
            });
        }
    ], function(error, senderList) {
        var count = 0;
        senderList.forEach(function(element) {
            waterfall([
                function(callback1) {
                    mailConfigurationModel.findOne({}, {
                        replyTo: 1,
                        cc: 1,
                        bcc: 1,
                        senderName: 1,
                        email: 1,
                        smtpHost: 1,
                        port: 1,
                        authentication: 1,
                        password: 1,
                        username: 1,
                        clientId: 1,
                        clientSecret: 1,
                        refreshToken: 1,
                        accessToken: 1,
                        smtpService: 1,
                        customerId: 1,
                        customerObjectId: 1
                    }, function(err, result) {
                        callback1(null, result);
                    });
                },
                function(emailData, callback1) {
                    mailCommunication.customerEmail(emailData, function(result) {
                        callback1(null, emailData, result);
                    });
                },
                function(sender, emailTraporter, callback1) {
                    var mailOptions = {
                        recipient: element.email,
                        subject: element.subject,
                        html: element.content
                    };
                    mailCommunication.sendEmail(mailOptions, emailTraporter, sender, function(emailErr, emailResult) {
                        var emailLogObj;
                        if (emailErr) {
                            emailLogObj = {
                                sender: sender.username,
                                to: element.email,
                                subject: element.subject,
                                body: element.content,
                                emailStatus: 'Failed',
                                statusDetails: [emailErr]
                            };
                            callback1(null, false, emailLogObj, emailErr);

                        } else {
                            emailLogObj = {
                                sender: sender.username,
                                to: element.email,
                                subject: element.subject,
                                body: element.content,
                                emailStatus: 'Succeeded',
                                statusDetails: [emailResult]
                            };
                            callback1(null, true, emailLogObj, emailResult);
                        }
                    });
                }
            ], function(err, emailSent, emailLogObj, emailResult) {
                count = count + 1;
                if (emailSent) {
                    emailLogObj.created_by = req.decoded._id;
                    var mailLogObj = new emailLogsModel(emailLogObj);
                    mailLogObj.save(function(err, result) {

                    });
                    mailConfigurationModel.updateOne({}, {
                        $set: {
                            successfullyConfigured: "true"
                        }
                    }, { upsert: true }, function(err, result) {});
                } else {
                    var mailLogObj = new emailLogsModel(emailLogObj);
                    mailLogObj.save(function(err, result) {});
                }
                if (count == senderList.length) {
                    res.status(200).json({ message: "Successfully Send" });
                }
            });
        })

    });
}