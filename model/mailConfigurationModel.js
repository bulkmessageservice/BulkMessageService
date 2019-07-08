var mongoose = require('mongoose');
var schema = mongoose.Schema;

var mailConfigurationSchema = new schema({
    replyTo: { type: String },
    cc: { type: String },
    bcc: { type: String },
    senderName: { type: String },
    email: { type: String },
    smtpHost: { type: String },
    port: { type: Number },
    authentication: { type: String },
    password: { type: String },
    username: { type: String },
    clientId: { type: String },
    clientSecret: { type: String },
    refreshToken: { type: String },
    accessToken: { type: String },
    successfullyConfigured: { type: String },
    smtpService: { type: String },
    created_at: { type: Date, default: Date.now }
});

mailConfigurationSchema.index({ senderName: 'text', email: 'text' });

exports.mailConfigurationModel = mongoose.model('mailConfigurationModel', mailConfigurationSchema);