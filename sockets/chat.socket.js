const newMessage = require('../models/message.model').newMessage;

module.exports = io => {
    io.on('connection', socket => {
        // Listen Event JoinChat From chat.js
        socket.on('joinChat', chatId => {
            socket.join(chatId);
        })
        // Listen Event Send Message From chat.js
        socket.on('sendMessage', (message, emMessage) => {
            newMessage(message).then(() => {
                // message.chat => chatId This Room
                io.to(message.chat).emit('newMessage', message);
                // Clear Text Area After Sent Message
                emMessage();
            })
        })
    })
}