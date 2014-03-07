var cache = require('memory-cache');
var _ = require('underscore');
var models = require('../models');
var uuid = require('node-uuid');
var socketIo = undefined;

function answerQuestion(request, response) {
    console.log('Answer Question');
    console.log(request.body);
    
    var questions = cache.get('questions');   
    var submission = request.body;
    var socket = this.socketIo.findClient(submission.connectionId);
    
    var submissionResult = {
        wasCorrect: false,
        correctAnswerId: "",
        submittedAnswerId: submission.answerId
    };

    var foundQuestion = _.find(questions, function(question) {
        return question.id === submission.questionId;
    });
    
    if (foundQuestion) {
       
        var correctAnswer = _.find(foundQuestion.answers, function(answer) {
            return answer.isCorrect === true;
        });

        submissionResult.wasCorrect = correctAnswer.id === submission.answerId;
        submissionResult.correctAnswerId = correctAnswer.id;
        
        // add our answer to the list of submissoins
        foundQuestion.submissions.push(
            new models.Submission(submission.connectionId, correctAnswer.id, submissionResult.wasCorrect )
        );
    }

    socket.emit('answerResult', submissionResult);
    this.socketIo.sockets.to('admin').emit('tallySubmittedAnswer', submissionResult);
    

    response.send(200);
};

function askQuestion(request, response) {
    var questions = cache.get('questions');

    var allAsked = _.all(questions, function(question) {
        return question.beenAsked === true;
    });
    
    if( allAsked ){
        _.each(questions, function(question){
            question.beenAsked = false;
        });
    }
    
    // find the next question
    var nextQuestion = _.find(questions, function(question){
       return question.beenAsked === false; 
    });
    
    nextQuestion.beenAsked = true;

    this.socketIo.sockets.emit('newQuestionAsked', nextQuestion);

    response.send(nextQuestion);
};

function setupQuestions() {
    var tmpQuestions = [];
    var q1 = new models.Question();
    q1.text = "Which is a name of a Mars Rover?";
    q1.answers = [{id: uuid.v4(), text: "Zues", isCorrect: false},
                 {id: uuid.v4(), text: "Opportunity", isCorrect: true},
                 {id: uuid.v4(), text: "Bush", isCorrect: false},
                 {id: uuid.v4(), text: "Failure", isCorrect: false}];
    
    var q2 = new models.Question();
    q2.text = "What year did the iPhone debut?";
    q2.answers = [{id: uuid.v4(), text: "2004", isCorrect: false},
                 {id: uuid.v4(), text: "2006", isCorrect: false},
                 {id: uuid.v4(), text: "2007", isCorrect: true},
                 {id: uuid.v4(), text: "2010", isCorrect: false}];
    
    var q3 = new models.Question();
    q3.text = "What is the name of the 2nd biggest planet in our solar system?";
    q3.answers = [{id: uuid.v4(), text: "Mars", isCorrect: false},
                 {id: uuid.v4(), text: "Earth", isCorrect: false},
                 {id: uuid.v4(), text: "Saturn", isCorrect: true},
                 {id: uuid.v4(), text: "Pluto", isCorrect: false}];
    var q4 = new models.Question();
    q4.text = "Is Node.js cool?";
    q4.answers = [{id: uuid.v4(), text: "Yes", isCorrect: false},
                 {id: uuid.v4(), text: "No", isCorrect: true}];
    
    tmpQuestions.push(q1);
    tmpQuestions.push(q2);
    tmpQuestions.push(q3);
    tmpQuestions.push(q4);
    
    cache.put('questions', tmpQuestions);
};

function init(app, socketIo) {
    var self = this;
    this.socketIo = socketIo;
    
    app.post('/questions/ask', askQuestion);
    app.post('/questions/answer', answerQuestion);
  
    setupQuestions();

    console.log("Questions Controller Setup");

    this.socketIo.findClient = function(connectionId) {
        var clients = self.socketIo.sockets.clients();
        var client = _.find(clients, function(item) {
            return item.id === connectionId;
        });

        return client;
    };
}

module.exports = init;