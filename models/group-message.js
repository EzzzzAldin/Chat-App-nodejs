const mongoose = require('mongoose');

const DB_URL = 'mongodb+srv://EzzAldin:Naruto74@cluster0.cufwz.mongodb.net/chat-app?retryWrites=true&w=majority';

const messageSchema = mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    content: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    timestamp: Number
});

const Message = mongoose.model("group-message", messageSchema);

exports.getMessages = async groupId => {
    // Use Try And Catch to Know if Found Error
    try {
         // DB connect
         await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        //  Get Message Data And Replace Chat Id By Populate To Get Data
        let messages = await Message.find({
                group: groupId
                }, null, {
                    sort: {
                        timestamp: 1
                        }
                    }).populate({
                        // Name Filed
                        path: 'group',
                        // Location to Filed
                        model: 'group',
                            populate: {
                                path: 'users',
                                model: 'user',
                                select: 'username image'
                            }
                     }).populate({
                        path: 'sender',
                        model: 'user',
                        select: 'username image'
                     })
        mongoose.disconnect();
        return messages;    
    } catch (error) {
        mongoose.disconnect();
        throw Error(error);
    }
};

exports.newMessage = async message => {
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        message.timestamp = Date.now();
        // Create New Message And Save In DB
        let newMessage = new Message(message);
        await newMessage.save();
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw Error(error);
    }
};