var port = 8181;
var express = require('express');
var socketIo = require('socket.io');

var app = express();
//var logs = new Array();
app.debugLogs = [{}];

app.configure(function() {
    app.use(express.bodyParser());

    app.use('/css', express.static(__dirname + '/views/css'));
    app.use('/js', express.static(__dirname + '/views/js'));
    app.use('/vm', express.static(__dirname + '/views/vm'));

    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
});

var server = app.listen(port, function() {
    console.log("Listening on port " + port);
});

var io = socketIo.listen(server);

app.get('/', function(request, response) {
    response.render('index.html');
});

app.post('/debug/log', function(request, response) {
    console.log(request.body);
    response.send(200);
    
    io.sockets.emit('onNewLog', request.body);
});

io.sockets.on('connection', function(socket) {
    console.log('New Connection ' + socket.id);

    socket.emit('onConnected', { connectionId: socket.id });

    socket.on('clearLogs', function(data) {
        io.sockets.emit('onClearLogs');
    });
});