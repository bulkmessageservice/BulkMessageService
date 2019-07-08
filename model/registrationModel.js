var mongoose = require('mongoose');

var schema = mongoose.Schema;

var registrationSchema = new schema({
    email: { type: String },
    fullname: { type: String },
    phone: { type: String },
    password: { type: String },
    token: { type: String },
    tokenStatus: { type: Boolean },
    OAuthID: { type: String },
    OAuthType: { type: String },
    created_at: { type: Date, default: Date.now }

});

exports.registrationModel = mongoose.model('registrationModel', registrationSchema);