var mongoose = require('mongoose');

var schema = mongoose.Schema;

var registrationSchema = new schema({

    password: { type: String },
    sub: { type: String },
    name: { type: String },
    given_name: { type: String },
    family_name: { type: String },
    email: { type: String },
    fullname: { type: String },
    Email: { type: String, unique: true },
    phone: { type: Number },
    token: { type: String },
    tokenStatus: { type: Boolean },
    password: { type: String },
    OAuthID: { type: String },
    OAuthType: { type: String },
    created_at: { type: Date, default: Date.now }

});

exports.registrationModel = mongoose.model('registrationModel', registrationSchema);