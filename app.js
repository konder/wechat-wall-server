var express = require('express');

var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var path = require('path');
var io = require('socket.io');
var config = require('./config');

var shakeRouter = require('./routes/shake');
var messageRouter = require('./routes/message');

var app = express();

// all environments
app.set('port', process.env.PORT || config.port);
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
    saveUninitialized: true,
    secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.use('/shake', shakeRouter);
app.use('/message', messageRouter);

var server = app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var shake = require('./ctrler/shake');
global.io = io.listen(server);
global.io.on('connection', function(socket){
    socket.on('shake', function(msg){
        shake.add(msg);
    });
});

