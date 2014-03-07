var cache = require('memory-cache');
var moment = require('moment');
var _ = require('underscore');

// below deal w/ connection management
var connect = function(socket) {
    var connections = cache.get('connections') || [];
    var connection = {
        id: socket.id,
        when: moment().format(),
        name: "",
        type: "unknown"
    };

    connections.push(connection);

    cache.put('connections', connections);

    var foo = cache.get('connections');
};

var disconnect = function(socket) {
    var connections = cache.get('connections') || [];
    var connection = _.find(connections, function(item) {
        return item.id === socket.id;
    });   
    
    if (connection) {
        connections.pop(connection);
        cache.put('connections', connections);
        
        socket.broadcast.to('admin').emit('userUnregistered', connection);
        
    }
};

var find = function(connectionId) {
    console.log("[find] " + connectionId);
    
    var connections = cache.get('connections') || [];
    var connection = _.find(connections, function(item) {
        return item.id === connectionId;
    });

    return connection;
};

var save = function(existingConnection) {
    console.log("[save] " + existingConnection);
    
    var connections = cache.get('connections') || [];
    var connection = _.find(connections, function(item) {
        return item.id === existingConnection.id;
    });

    var index = connections.indexOf(connection);
    connections[index] = existingConnection;
};
    
module.exports = {
    current: cache.get('connections') || [],
    connect: connect,
    disconnect: disconnect,
    find: find,
    save: save
    
};
