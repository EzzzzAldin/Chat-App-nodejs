const groupModel = require('../models/group.model');
const messageModel = require('../models/group-message');
const getFriends = require('../models/user.model').getFriends;

exports.getUserGroups = (req, res) => {
    groupModel.getUserGroups(req.session.userId).then(groups => {
        res.render('groups', {
            pageTitle: 'Groups',
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            groups: groups
        })
    }).catch(err => {
        res.redirect("/error");
    });
};

exports.getCreateGroup = (req, res) => {
    // Get Data Friends
    getFriends(req.session.userId).then(friends => {
        res.render('create-group', {
            pageTitle: 'Create Group',
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            friends: friends
        })
    }).catch(err => {
        res.redirect("/error");
    });
};

exports.postCreateGroup = (req, res) => {
    groupModel.createGroup(req.body).then(id => {
        res.redirect("/groups/" + id);
    }).catch(err => {
        res.redirect("/error");
    })
};

exports.getGroup = (req, res) => {
    // Get Chat Id
    let chatId = req.params.id;
    messageModel.getMessages(chatId).then(messages => {
        // If Do not Found Message To get Data User
        if (messages.length === 0) {
            groupModel.getGroupInfo(chatId).then(data => {
                res.render('group-chat', {
                    pageTitle: data.name,
                    isUser: req.session.userId,
                    friendRequests: req.friendRequests,
                    messages: messages,
                    group: data
                })
                })
        } else {
        res.render('group-chat', {
            pageTitle: messages[0].group.name,
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            messages: messages,
            group: messages[0].group
        })
    }
    });
}