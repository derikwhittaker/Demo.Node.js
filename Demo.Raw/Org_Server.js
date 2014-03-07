var port = 8118;
var express = require('express');
var socketIo = require('socket.io');
var models = require('./Models');

//testing
var u1 = models.User;
var u2 = models.User;
var u3 = new Userx();

u1.name = "Derik";
u2.name = "bob";

var quizController = require('./QuizController');

var Quiz = new quizController.Quiz();


var app = express();
var server = app.listen(port, function(){
        console.log("Listening on port " + port );
    });

var io = socketIo.listen(server);

app.configure(function() {
   app.use(express.bodyParser());
});

app.post('/quiz/register', function(request, response){
    
    console.log("[Route Request] " + request.path);
    console.log("[Body Value] " + request.body);
    
    response.json(request.body);
});

app.post('/questions/ask', function(request, response) {

    
    var newQuestion = Quiz.nextQuestion();

    io.sockets.emit('receiveNewQuestion ', newQuestion);

    response.send(newQuestion);
});

io.on('connection', function (socket) {
  socket.emit('connected', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});



