const mongoose = require('mongoose');
const DB_URL = 'mongodb+srv://EzzAldin:Naruto74@cluster0.cufwz.mongodb.net/chat-app?retryWrites=true&w=majority';

const User = require('./user.model').User;

const bcrypt = require('bcrypt');

exports.createNewUser = (username, email, password) => {
    return new Promise((resolve, reject) => {
        // DB Connect
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Check Email is Exits 
            return User.findOne({email: email})
        }).then(user => {
            if(user) {
                // if email Is Find 
                mongoose.disconnect();
                reject('Email is used');
            } else {
                // If email is not Find in DB and Locked Password
                return bcrypt.hash(password, 10);
            }
        }).then(hashedPassword => {
            // Save new User Data in collection user in DB 
            let user = new User ({
                username: username,
                email: email,
                password: hashedPassword
            })
            return user.save();
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            reject(err);
        })
    });
};

exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        // DB Connect
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Check Email is Exits 
            return User.findOne({email: email});
        }).then(user => {
            if(!user) {
                mongoose.disconnect();
                reject('there is no user matches this email');
            } else {
                // Check Password
                bcrypt.compare(password, user.password).then(same => {
                    // Password is not same Password in DB
                    if(!same) {
                        mongoose.disconnect();
                        reject('the Password is incorrect');
                    } else {
                        mongoose.disconnect();
                        resolve(user);
                    }
                });
            }
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        });
    });
};

