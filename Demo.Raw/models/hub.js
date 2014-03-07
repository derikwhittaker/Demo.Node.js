var broadcastNewUser = function(socket, session) {
    console.log("Broadcast New User " + session);
    socket.broadcast.to('admin').emit('userRegistered', session);

};

module.exports = {
    broadcastNewUser: broadcastNewUser
    
};