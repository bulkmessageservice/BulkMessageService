var config = require('./OAuthConfig');
var request = require('request');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var secret_key = 'SRCEukzwWJybZkUpHVdA5PtdkFvWPmddyUwtb2';

require('../model/registrationModel.js');
var registrationModel = mongoose.model('registrationModel');


exports.googleLogin = function(req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.GOOGLE_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    request.post(accessTokenUrl, {
        json: true,
        form: params
    }, function(err, response, token) {
        var accessToken = token.access_token;
        var headers = {
            Authorization: 'Bearer ' + accessToken
        }
        request.get({
            url: peopleApiUrl,
            headers: headers,
            json: true
        }, function(err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({
                    message: profile.error.message
                });
            } else {
                registrationModel.findOne({ OAuthID: profile.sub }, function(err, result) {
                    if (result) {
                        var jwtObj = {
                            _id: result._id
                        };
                        var token = jwt.sign(jwtObj, secret_key, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).json({ token: token });
                    } else {
                        var googleObj = {
                            email: profile.email,
                            fullname: profile.name,
                            OAuthID: profile.sub,
                            OAuthType: 'Google'
                        }
                        var registrationData = new registrationModel(googleObj);
                        registrationData.save(function(err, result) {
                            if (result) {
                                var jwtObj = {
                                    _id: result._id
                                };
                                var token = jwt.sign(jwtObj, secret_key, {
                                    expiresIn: 86400 // expires in 24 hours
                                });
                                res.status(200).json({ token: token });
                            }
                        })
                    }
                })

            }

        });

    });
};