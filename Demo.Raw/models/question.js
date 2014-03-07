var uuid = require('node-uuid');

function Question() {
    this.id = uuid.v4();
    this.text = "";
    this.answers = [];
    this.submissions = [];
    this.beenAsked = false;
};

module.exports = Question;