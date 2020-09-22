const newMessage = require('../models/group-message').newMessage;

module.exports = io => {
    io.on('connection', socket => {
        // Listen Event JoinChat From group.js
        socket.on('joinChat', chatId => {
            socket.join(chatId);
        })
        socket.on('sendGroupMessage', (message, emMessage) => {
            newMessage(message).then(() => {
                // message.group => groupId This Room
                io.to(message.group).emit('newMessage', message);
                // Clear Text Area After Sent Message
                emMessage();
            })
        })
    })
}