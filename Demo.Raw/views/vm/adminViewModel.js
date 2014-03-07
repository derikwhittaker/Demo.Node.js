var admin;
(function (admin) {
    // Class
    var adminViewModel = (function () {
        function adminViewModel() {
            //this.hostUrl = "http://signalrmvchost.azurewebsites.net/signalr";
            this.hostUrl = "http://localhost:8118";
            this.connectionId = "";
            this.isConnected = ko.observable(null);
            this.socketConnection = io.connect(this.hostUrl);
            this.users = ko.observableArray([]);
            this.question = ko.observable(new Question());
            
            this.setupCallbacks(this.socketConnection);      
        }
        
        adminViewModel.prototype.setupCallbacks = function (socketConnection) {
            var self = this;
            
            socketConnection.on('onConnected',  function(data) {
                console.log('Connected');
                console.log(data);

                self.connectionId = data.connectionId;
                self.registerAsAdmin();
            });

            socketConnection.on('userRegistered', function(data) {
                console.log("userRegistered");
                console.log(data);

                var user = {
                    userName: data.userName,
                    connectionId: data.connectionId
                };

                self.users.push(user);

            });
            
            socketConnection.on('userUnregistered', function(data) {
                console.log("userUnregistered");
                console.log(data);

                var foundUser = _.find(self.users, function(user) {
                    return user.connectionId === data.connectionId;
                });

                self.users.pop(foundUser);
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

            socketConnection.on('tallySubmittedAnswer', function(submission) {
                console.log(submission);

                self.question().results.push(submission);
            });
        };
        
        adminViewModel.prototype.registerAsAdmin = function() {
            var user = {
                userName: "admin user",
                connectionId: this.connectionId
            };

            $.ajax({
                type: "POST",
                url: this.hostUrl + '/quiz/admin',
                data: user,
            }).success(function() {
                $("#signIn").hide();
                $("#playGame").show();
            });
            
        };

        adminViewModel.prototype.sendNextQuestion = function() {
            $.ajax({
                type: "POST",
                url: this.hostUrl + '/questions/ask'
            }).success(function() {
                console.log("Question Asked");
            });

        };

        return adminViewModel;
    })();
    admin.adminViewModel = adminViewModel;

    var Question = (function() {

        function Question(id, question) {
            var self = this;
            this.id = ko.observable(id);
            this.question = ko.observable(question);
            this.answers = ko.observableArray([]);
            this.results = ko.observableArray([]);
            
            this.correctCount = ko.computed(function() {

                var count = _.filter(self.results(), function(result) {
                    return result.wasCorrect === true;
                }).length;

                return count;
            });

            this.incorrectCount = ko.computed(function() {

                var count = _.filter(self.results(), function(result) {
                    return result.wasCorrect === false;
                }).length;

                return count;
            });
        }

        return Question;
    })();
    admin.Question = Question;

    var Answer = (function () {
        function Answer(answerId, answerText) {
            this.id = ko.observable(answerId);
            this.text = ko.observable(answerText);
            this.status = ko.observable("");
            this.selectedAnswer = ko.observable(false);            
        }
        return Answer;
    })();
    admin.Answer = Answer;
    
})(admin || (admin = {}));

