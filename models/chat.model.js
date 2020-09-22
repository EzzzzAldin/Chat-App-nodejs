const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/chat-app';

const chatShema = mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
});

const Chat = mongoose.model('chat', chatShema);

exports.Chat = Chat;

exports.getDataUser = async chatId => {
    // Use Try And Catch to Know if Found Error
    try {
         // DB connect
         await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        //  Get Data User And Replace Chat Id By Populate To Get Data
        let chat = await Chat.findById(chatId).populate('users');
        mongoose.disconnect();
        return chat;    
    } catch (error) {
        mongoose.disconnect();
        throw Error(error);
    }
};
