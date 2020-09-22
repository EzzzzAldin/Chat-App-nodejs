const { sendFriendRequest, getFriends } = require('../models/user.model');

module.exports = io => {
    io.on('connection', socket => {
        socket.on('sendFriendRequest', data => {
            sendFriendRequest(data).then(() => {
                socket.emit('requestSent')
                io.to(data.friendId).emit('newFriendRequest', {name: data.myName, id: data.myId})
            }).catch(err => {
                socket.emit('Request Fialed')
            })
        });
        
        // Listen Event Get Online Friends
        socket.on('getOnlineFriends', id => {
            // Get Friends By My Id
            getFriends(id).then(friends => {
                let onlineFriends = friends.filter( friend => io.onlineUsers[friend.id])
                // Create New Event to Pass Online Friends to home.js
                socket.emit('onlineFriends', onlineFriends);
            })
        })
    });
};