const userModel = require('../models/user.model');


exports.getProfile = (req, res) => {
    // Get User Id
    let id = req.params.id;
    // If I Enter My Profile
    if (!id) return res.redirect('/profile/' + req.session.userId)
    // Run Function getUserData 
    userModel.getUserData(id)
             .then(data => {
                 res.render('profile', {
                    pageTitle: data.username,
                     isUser: req.session.userId,
                     friendRequests: req.friendRequests,
                     myId: req.session.userId,
                     myName: req.session.name,
                     myImage: req.session.image,
                     friendId: data._id,
                     username: data.username,
                     userImage: data.image,
                    // First possibility Check Enter This your Profile OR Other Profile
                    isOwner: id === req.session.userId,
                    // Second possibility if This Profile is Friend
                    isFriends: data.friends.find( friend => friend.id === req.session.userId),
                    // Third possibility User1 Sent Friend Request to User2
                    isRequestSent: data.friendRequsts.find( friend => friend.id === req.session.userId),
                    // Forth possibility User1 Recieved Friend Request in User2
                    isRequestRecieved: data.sentRequsts.find( friend => friend.id === req.session.userId)
                 })
             })
};