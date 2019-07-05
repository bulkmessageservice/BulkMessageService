var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dburi = 'mongodb://127.0.0.1:27017/bulkMessageService';

mongoose.connect(dburi, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connection.on('connected', function() {
    console.log('Database is successfully connected');
});

mongoose.connection.on('error', function() {
    console.error('Database connection failed!!!');
});