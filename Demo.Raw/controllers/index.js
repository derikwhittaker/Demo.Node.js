

function init(app, socketIo, connections) {

    require('./quizController')(app, socketIo, connections);
    require('./questionsController')(app, socketIo);
    require('./viewController')(app);
    require('./debugController')(app);
    
}

module.exports = init;