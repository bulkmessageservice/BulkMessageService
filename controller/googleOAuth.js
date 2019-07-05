var config = require('./OAuthConfig');
var request = require('request');
var mongoose = require('mongoose');

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
        console.log("line 25", token);
        var accessToken = token.access_token;
        var headers = {
            Authorization: 'Bearer ' + accessToken
        }


        request.get({
            url: peopleApiUrl,
            headers: headers,
            json: true
        }, function(err, response, profile) {
            console.log("Line 36", profile);

            if (response.statusCode !== 200) {
                return res.status(500).send({
                    message: profile.error.message
                });
            } else {
                var registrationData = new registrationModel(profile);
                registrationData.save(function(err, result) {
                    if (result) {
                        console.log(result);
                        res.status(200).json({ result: result });
                    }
                    if (err) {
                        console.log(err);
                    }
                })
            }

        });

    });
};