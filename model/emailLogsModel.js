var mongoose = require('mongoose');
var schema = mongoose.Schema;

var emailLogsSchema = new schema({
    logId: { type: String },
    sender: { type: String },
    to: { type: String },
    cc: { type: String },
    bcc: { type: String },
    subject: { type: String },
    body: { type: String },
    emailStatus: { type: String },
    statusDetails: { type: Array },
    created_at: { type: Date, default: Date.now }
});

emailLogsSchema.index({ logId: 'text', sender: 'text', to: 'text', subject: 'text', body: 'text' });

exports.emailLogsModel = mongoose.model('emailLogsModel', emailLogsSchema);