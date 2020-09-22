const messageModel = require('../models/message.model');
const chatModel = require('../models/chat.model');

exports.getChat = (req, res) => {
    // Get Chat Id
    let chatId = req.params.id;
    messageModel.getMessages(chatId).then(messages => {
        // If Do not Found Message To get Data User
        if (messages.length === 0) {
            chatModel.getDataUser(chatId).then(chat => {
                let friendData = chat.users.find(
                    user => user._id != req.session.userId
                );
                res.render('chat', {
                    pageTitle: friendData.username,
                    isUser: req.session.userId,
                    friendRequests: req.friendRequests,
                    messages: messages,
                    friendData: friendData,
                    chatId: chatId
                })
                })
        } else {
        // Get Friend Data From Message Model
        let friendData = messages[0].chat.users.find(
                user => user._id != req.session.userId
        );
        res.render('chat', {
            pageTitle: friendData.username,
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            messages: messages,
            friendData: friendData,
            chatId: chatId
        })
    }
    });
};