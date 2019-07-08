var mongoose = require('mongoose');
require('../model/registrationModel.js');
var registrationModel = mongoose.model('registrationModel');

var randomstring = require('randomstring');
var fs = require('fs');
var waterfall = require('async-waterfall');
var ejs = require('ejs');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
var secret_key = 'SRCEukzwWJybZkUpHVdA5PtdkFvWPmddyUwtb2';

var communication = require('../communication');


exports.saveRegistration = function(req, res) {
    var token = randomstring.generate({
        length: 150,
        charset: 'alphanumeric'
    });
    waterfall([
        function(callback) {
            req.body.token = token;
            req.body.tokenStatus = false;
            var registrationData = new registrationModel(req.body);
            registrationData.save(function(err, result) {
                if (err) {
                    console.log('mongodb-error:', err.code);
                    res.json({ error: err.code });
                }
                callback(null, result);
            });
        }
    ], function(err, result) {
        var str = fs.readFileSync(process.cwd() + '/views/create_password.ejs', 'utf8');
        var emailJSON = {
            'name': req.body.fullName,
            'accessUrl': req.protocol + "://" + req.get('host') + '/create-user-password/' + token
        };
        htmlContent = ejs.render(str, emailJSON);
        var mailOptions = {
            recipient: result.email,
            subject: 'Create Your Password',
            html: htmlContent
        };
        communication.sendEmail(mailOptions, function(err, result) {
            console.log("sendEmail-result:", result);
        })
    })

};
exports.getUserList = function(req, res) {
    registrationModel.find({}, function(err, result) {
        res.status(200).json({ result: result });
    })
}


exports.createUserPassword = function(req, res) {
    registrationModel.findOne({ 'token': req.query.token }, { password: 0 }, function(err, result) {
        if (result == null) {
            res.status(498).json({ message: "Sorry! Token is expired or not valid" });
        } else if (result.tokenStatus == true || result.tokenStatus == null) {
            res.status(498).json({ message: "Sorry! Token is expired or not valid" });
        } else {
            res.status(200).json({ result: result });
        }
    });
}

exports.savePassword = function(req, res) {
    var hashnewPassword = bcrypt.hashSync(req.body.password);
    registrationModel.updateOne({ 'token': req.body.token }, {
        $set: {
            password: hashnewPassword,
            tokenStatus: true
        }
    }, function(err, result) {
        if (result.n == 1) {
            res.status(200).json({ message: "Password created successfully" });
        }
    })
}
exports.login = function(req, res) {
    registrationModel.findOne({ email: req.body.email }, function(err, result) {
        if (!err) {
            if (result.tokenStatus) {
                var checkPassword = bcrypt.compareSync(req.body.password, result.password);
                if (checkPassword) {
                    var jwtObj = {
                        _id: result._id
                    };
                    var token = jwt.sign(jwtObj, secret_key, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).json({ token: token });
                } else {
                    res.status(401).send({ message: 'The username and password you entered don\'t match!' });
                }
            } else {
                res.status(401).json({ message: 'Sorry, Server doesn\'t recognize that username!' });
            }
        } else {
            res.status(500).json({ message: 'Server problem, please try again' });
        }
    });
}

exports.forgotPassword = function(req, res) {
    var resetToken = randomstring.generate({
        length: 150,
        charset: 'alphanumeric'
    });
    waterfall([
        function(callback) {
            registrationModel.findOne({ email: req.body.email }, function(err, result) {
                if (result) {
                    callback(null, result);
                } else {
                    res.status(404).json({ message: 'The email you have entered does not exist' });
                }
            })
        },
        function(result, callback) {
            registrationModel.updateOne({ _id: result._id }, {
                $set: {
                    resetToken: resetToken,
                    resetTokenStatus: false
                }
            }, function(err, updateResult) {
                if (updateResult.n == 1) {
                    callback(null, result);
                }
            })
        },
        function(result, callback) {
            var str = fs.readFileSync(process.cwd() + '/views/forget_password.ejs', 'utf8');
            var emailJSON = {
                'name': result.fullname,
                'accessUrl': req.protocol + "://" + req.get('host') + '/reset-user-Password/' + resetToken
            };

            htmlContent = ejs.render(str, emailJSON);
            var mailOptions = {
                recipient: result.email,
                subject: 'Create Your Password',
                html: htmlContent
            };
            communication.sendEmail(mailOptions, function(err, result) {
                console.log(result);
                res.status(204).json({});
                console.log("sendEmail-result:", result);
            })
        }
    ])

}

exports.resetPassword = function(req, res) {
    var hashnewPassword = bcrypt.hashSync(req.body.NewPassword);
    registrationModel.updateOne({ resetToken: req.body.resetToken }, {
        $set: {
            password: hashnewPassword,
            resetTokenStatus: true
        }
    }, function(err, updateResult) {
        console.log(updateResult)
        res.status(200).json({ message: 'Reset Password successfully' });
    })
}