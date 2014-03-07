var port = 8118;
var path = require('path');
var express = require('express');
var socketIo = require('socket.io');
var models = require('./models');
var controllers = require('./controllers');

var app = express();
    
app.configure(function() {
    
    app.use(express.bodyParser());
    
    // this allows me to not have to reference the full path
    app.use('/css', express.static(__dirname + '/views/css'));
    app.use('/js', express.static(__dirname + '/views/js'));
    app.use('/vm', express.static(__dirname + '/views/vm'));
    app.use('/bootstrap/js', express.static(__dirname + '/bower_components/bootstrap/dist/js'));
    
    app.use(express.static(__dirname + '/bower_components'));
    app.use(require('less-middleware')({ src: __dirname + '/bower_components' }));
    
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    
    
});

var server = app.listen(port, function() {
    console.log("Listening on port " + port);
});

var io = socketIo.listen(server);
var socket = undefined;


io.sockets.on('connection', function(socket) {
    console.log('Client Connected');
    console.log(socket.id);

    models.connections.connect(socket);

    socket.emit('onConnected', {
         message: 'Connected',
         connectionId: socket.id
    });

    socket.on('disconnect', function() {
        console.log('Client Disconnected');
        console.log(socket.id);
        models.connections.disconnect(socket);
    });
    
});

controllers(app, io, models.connections);
