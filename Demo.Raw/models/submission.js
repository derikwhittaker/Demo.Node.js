var Submission = function(connectionId, answerId, wasCorrect) {
    this.connectionId = connectionId;
    this.answerId = answerId;
    this.wasCorrect = wasCorrect;              
};


module.exports = Submission;