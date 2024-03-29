const express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    path = require('path'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

global.mongoose = mongoose;

var app = express();
var adminRouter = express.Router();
app.use(cors());

var server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));
app.use(express.static(__dirname + '/public'));

require('./routes/routes')(app, adminRouter, multipartMiddleware);
require('./database/db');

app.route('/*').get(function(req, res) {
    res.sendFile(path.resolve('./public' + '/index.html'));
});

server.listen(3000, function() {
    console.log('Server is listening on port 3000.');
})