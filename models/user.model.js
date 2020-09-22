const mongoose = require('mongoose');

const Chat = require('./chat.model').Chat;

const DB_URL = 'mongodb+srv://EzzAldin:Naruto74@cluster0.cufwz.mongodb.net/chat-app?retryWrites=true&w=majority';


const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: {
        type: String,
        default: 'Naruto Wallpapers.jpg'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    friends: {
        type: [{ name: String, image: String, id: String, chatId: String }],
        default: []
    },
    friendRequsts: {
        type: [{ name: String, id: String }],
        default: []
    },
    sentRequsts: {
        type: [{ name: String, id: String }],
        default: []
    }
});

const User = mongoose.model("user", userSchema);

exports.User = User;

exports.getUsers = async query => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        let users = await User.find(query);
        return users;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getUserData = id => {
    return new Promise((resolve, reject) => {
        // Connect DB
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Find User Id
            return User.findById(id);
        }).then(data => {
            mongoose.disconnect();
            resolve(data)
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        });
    });
};

exports.sendFriendRequest = async (data) => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Add My Data To Friend FriendRequest
        await User.updateOne({_id: data.friendId}, 
            // Push My Data in Array FrindRequest to Friend 
            { $push: { friendRequsts: { name: data.myName, id: data.myId} }}
            );
        // Add Frind Data in My SentRequests
        await User.updateOne({_id: data.myId}, 
            // Push My Data in Array FrindRequest to Friend 
            { $push: { sentRequsts: { name: data.friendName, id: data.friendId} }}
            );
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.cancelFriendRequest = async (data) => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        await Promise.all([
            // Remove My Data To Friend FriendRequest
            User.updateOne({_id: data.friendId}, 
                // Pull My Data in Array FrindRequest to Friend 
                { $pull: { friendRequsts: { id: data.myId} }}
                ),
            // Remove Frind Data in My SentRequests
            User.updateOne({_id: data.myId}, 
                // Pull My Data in Array SentRequest to Friend 
                { $pull: { sentRequsts: { id: data.friendId} }}
                )
        ]);
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.acceptFriendRequest = async (data) => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // To Create ChatId
        let newChat = new Chat({
            users: [data.myId, data.friendId]
        });
        let chatDoc = await newChat.save();
        // Friend => The Sender
        // My => The Receives
        await Promise.all([
            // Remove My Data Form Friend SentRequest
             User.updateOne({_id: data.friendId},
                // Pull My Data in Array SentRequest to Friend 
                { $pull: { sentRequsts: { id: data.myId} }}
                ),
            // Remove Data Friend Form My FriendRequest
             User.updateOne({_id: data.myId},
                // Pull Data Friend in Array FriendRequest to me 
                { $pull: { friendRequsts: { id: data.friendId} }}
                ),
            // Add My Data To Friend Friend Array
             User.updateOne({_id: data.friendId},
                // Push My Data in Friend Friend Array
                { $push: { friends: { 
                    id: data.myId, 
                    name: data.myName, 
                    image: data.myImage,
                    chatId: chatDoc._id
                        }
                    }
                }
                ),
                // Add Data Friend To Friend Friend Array
                 User.updateOne({_id: data.myId},
                    // Push My Data in Friend Friend Array
                    { $push: { friends: { 
                        id: data.friendId, 
                        name: data.friendName, 
                        image: data.friendImage,
                        chatId: chatDoc._id
                        }
                    }
                }
                    )
        ]);
        mongoose.disconnect();
        return
        
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.rejectFriendRequest = async (data) => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        await Promise.all([
            // Friend => The Sender
            // My => The Receives
            // Remove My Data To Friend SentRequest
            User.updateOne({_id: data.friendId}, 
                // Pull My Data in Array SentRequest to Friend 
                { $pull: { sentRequsts: { id: data.myId} }}
                ),
            // Remove Frind Data in My FriendRequests
            User.updateOne({_id: data.myId}, 
                // Pull My Data in Array FriendRequest to Friend 
                { $pull: { friendRequsts: { id: data.friendId} }}
                )
        ]);
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.deleteFriend = async (data) => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB Connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        await Promise.all([
            // Remove My Data To Friend Array
            User.updateOne({_id: data.friendId}, 
            // Pull My Data in Array FrindRequest to Friend 
            { $pull: { friends: { id: data.myId} }}
            ),
            // Remove Frind Data in Friends Array
            User.updateOne({_id: data.myId}, 
            // Pull My Data in Array SentRequest to Friend 
            { $pull: { friends: { id: data.friendId} }}
            )
        ]);
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getFriendRequests = async id => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get Friend Requests
        let data = await User.findById(id, { friendRequsts: true});
        return data.friendRequsts;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    };
};

exports.getFriends = async id => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get Friend Requests
        let data = await User.findById(id, { friends: true});
        return data.friends;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    };
};