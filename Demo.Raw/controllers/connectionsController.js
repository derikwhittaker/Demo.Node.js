var cache = require('memory-cache');
var moment = require('moment');
var _ = require('underscore');

var connect = function(session) {
    var connections = cache.get('connections') || [];
    var connection = {
        id: session.id,
        when: moment().format(),
        name: "",
        type: "unknown"
    };

    connections.push(connection);

    cache.put('connections', connections);
};

var disconnect = function(session) {
    var connections = cache.get('connections') || [];
    var connection = _.find(connections, function(item) {
        return item.id === session.id;
    });
    
    if (connection) {
        connections.pop(connection);
        cache.put('connections', connections);
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
