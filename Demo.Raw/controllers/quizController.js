var _ = require('underscore');
var models = require('../Models');
var socketIo = undefined;
var connections = {};

function registerUser(request, response) {
    console.log("[registerUser] " + request.body.userName);
    var message = request.body;
    
    var connection = registerEntity(message, "user");
    
    if (connection) {
        this.socketIo.sockets.to('admin').emit('userRegistered', message);
    }
    
    response.send(connection || 400);
};

function registerAdmin(request, response) {
    console.log("[registerAdmin] " + request.body.userName);
    var message = request.body;
    
    var connection = registerEntity(message, "admin");

    response.send(connection || 400);
};

function registerEntity( entity, type) {
    
    var connection = this.connections.find(entity.connectionId);

    if (connection) {
        connection.name = entity.userName;
        connection.type = type;
        this.connections.save(connection);
        
        // find out socket and put this connection in the room
        var client = this.socketIo.findClient(entity.connectionId);
        client.join(type);

        return connection;
    } else {
        return undefined;
    }
};

function init(app, socketIo, connections) {
    var self = this;
    this.socketIo = socketIo;
    this.connections = connections;
    
    app.post('/quiz/user', registerUser);
    app.post('/quiz/admin', registerAdmin);
    
    console.log("Quiz Controller Setup");

    this.socketIo.findClient = function(connectionId) {
        var clients = self.socketIo.sockets.clients();
        var client = _.find(clients, function (item) {
            return item.id === connectionId;
        });

        return client;
    };
}

module.exports = init;