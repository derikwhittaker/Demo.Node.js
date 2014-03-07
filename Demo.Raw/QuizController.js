var models = require('./Models');
var _ = require('underscore');

var quiz = function(){};

quiz.prototype.nextQuestion = function(){
    
    // simply to reset the questions in case we need to cycle over
    var allAsked = _.all(questions, function(question){
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
    return nextQuestion;
};

quiz.prototype.submitAnswer = function(questionId, answerId, connectionId){
    
    
    return {};  
};


// i know, i know, i know.  globals are BAD
// but this is a demo and i don't want to introduce a db for this
questions = function(){
    var tmpQuestions = [];
    var q1 = new models.Question();
    q1.text = "Which is a name of a Mars Rover?";
    q1.answers = [{text: "Zues", isCorrect: false},
                 {text: "Opportunity", isCorrect: true},
                 {text: "Bush", isCorrect: false},
                 {text: "Failure", isCorrect: false}];
    
    var q2 = new models.Question();
    q2.text = "What year did the iPhone debut?";
    q2.answers = [{text: "2004", isCorrect: false},
                 {text: "2006", isCorrect: false},
                 {text: "2007", isCorrect: true},
                 {text: "2010", isCorrect: false}];
    
    var q3 = new models.Question();
    q3.text = "What is the name of the 2nd biggest planet in our solar system?";
    q3.answers = [{text: "Mars", isCorrect: false},
                 {text: "Earth", isCorrect: false},
                 {text: "Saturn", isCorrect: true},
                 {text: "Pluto", isCorrect: false}];
    var q4 = new models.Question();
    q4.text = "Is Node.js cool?";
    q4.answers = [{text: "Yes", isCorrect: false},
                 {text: "No", isCorrect: true}];
    
    tmpQuestions.push(q1);
    tmpQuestions.push(q2);
    tmpQuestions.push(q3);
    tmpQuestions.push(q4);
    
    return tmpQuestions;
}() ;

console.log(questions);

module.exports.Quiz = quiz;