const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/chat-app';

const groupSchema = mongoose.Schema({
    name: String,
    image: { type: String, default: 'Naruto Wallpapers.jpg' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
});

const Group = mongoose.model("group", groupSchema);

exports.createGroup = async data => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
       //  Get Data User And Replace Chat Id By Populate To Get Data
       let group = await new Group(data);
       let groupData = await group.save();
       mongoose.disconnect();
       return groupData._id;    
   } catch (error) {
       mongoose.disconnect();
       throw Error(error);
   }
};

exports.getUserGroups = async userId => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect 
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get Users From UserModel
        let groups = await Group.find({
            users: {
                $all: [userId]
            }
        });
        mongoose.disconnect();
        return groups;
    } catch (error) {
        mongoose.disconnect();
        throw Error(error);
    }
};

exports.getGroupInfo = async groupId => {
    // Use Try And Catch to Know if Found Error
    try {
        // DB connect 
        await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        // Get Users From UserModel
        let group = await Group.findById(groupId).populate({
            path: 'users',
            model: 'user',
            select: 'username image'
        })
        mongoose.disconnect();
        return group;
    } catch (error) {
        mongoose.disconnect();
        throw Error(error);
    }
};