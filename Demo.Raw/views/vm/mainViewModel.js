var client;
(function (client) {
    // Class
    var mainViewModel = (function () {
        function mainViewModel() {
            //this.hostUrl = "http://signalrmvchost.azurewebsites.net/signalr";
            this.hostUrl = "http://localhost:8118";
            this.userName = ko.observable("");
            this.connectionId = "";
            this.question = ko.observable(new Question());
            this.isConnected = ko.observable(null);
            this.socketConnection = io.connect(this.hostUrl);
            
            this.setupCallbacks(this.socketConnection);     
        }
        
        mainViewModel.prototype.setupCallbacks = function (socketConnection) {
            var self = this;

            socketConnection.on('onConnected', function(data) {
                console.log('Connected');
                console.log(data);
                self.connectionId = data.connectionId;
            });

            socketConnection.on('newQuestionAsked', function(question) {
                console.log('newQuestionAsked');
                console.log(question);

                var newQuestion = new Question(question.id, question.text);

                _.each(question.answers, function(answer) {
                    var newAnswer = new Answer(answer.id, answer.text);
                    newQuestion.answers.push(newAnswer);
                });

                self.question(newQuestion);
            });

            socketConnection.on('answerResult', function(result) {
                console.log('answerResult');
                console.log(result);
            });

        };

        mainViewModel.prototype.submitAnswer = function () {
            var question = this.question();
            var questionId = question.id();
            var selectedAnswer = _.find(question.answers(), function (answer) {
                return answer.selectedAnswer() !== false;
            });
            var selectedAnswerId = selectedAnswer.id();
            question.submitted(true);

            var answer = {
                connectionId: this.connectionId,
                questionId: questionId, 
                answerId: selectedAnswerId
            };

            $.ajax({
                type: "POST",
                url: this.hostUrl + '/questions/answer',
                data: answer,
            }).success(function(result) {
          
                console.log(result);
            });
        };

        mainViewModel.prototype.startGame = function() {

            var user = {
                userName: this.userName(),
                connectionId: this.connectionId
            };

            $.ajax({
                type: "POST",
                url: this.hostUrl + '/quiz/user',
                data: user,
            }).success(function(result) {
                $("#signIn").hide();
                $("#playGame").show();

                console.log(result);
            });
            
        };
        return mainViewModel;
    })();
    client.mainViewModel = mainViewModel;

    var Question = (function () {
        function Question(id, question) {
            this.id = ko.observable(id);
            this.question = ko.observable(question);
            this.answers = ko.observableArray([]);
            this.submitted = ko.observable(false);
        }
        return Question;
    })();
    client.Question = Question;

    var Answer = (function () {
        function Answer(answerId, answerText) {
            var _this = this;
            this.id = ko.observable(answerId);
            this.text = ko.observable(answerText);
            this.status = ko.observable("");
            this.selectedAnswer = ko.observable(false);
            
            this.statusCSS = ko.computed(function () {
                if (_this.status() == "correctlyAnswered") {
                    return "correct-answer";
                } else if (_this.status() == "expectedAnswer") {
                    return "correct-answer";
                } else if (_this.status() == "incorrectAnswer") {
                    return "wrong-answer";
                }

                return "";
            });
        }
        return Answer;
    })();
    client.Answer = Answer;
})(client || (client = {}));

