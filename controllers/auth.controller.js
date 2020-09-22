const authModel = require('../models/auth.model');
// Init Result express-validator
const validationResult = require('express-validator').validationResult;

exports.getSignup = (req, res) => {
    res.render('signup',{
        pageTitle: "Signup",
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false
    });
};

exports.postSignup = (req, res) => {
    // Check If not Found Errors
    if( validationResult(req).isEmpty()) {
        // Create New Account
        authModel.createNewUser(req.body.username, req.body.email, req.body.password)
                 .then(() => res.redirect('/login'))
                 .catch(err => {
                     console.log(err);
                     res.redirect('/signup');
                 });
    } else {
        req.flash('validationErrors', validationResult(req).array());
        res.redirect('/signup');
    }
};

exports.getLogin = (req, res) => {
    res.render('login', {
        // Show Error auth in Login Page
        pageTitle: "Login",
        authError: req.flash('authError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false
    })
};

exports.postLogin = (req, res) => {
    // Check if found Error
    if( validationResult(req).isEmpty()) {
        // Cheak Compar input Data and DataBase
        authModel
            .login(req.body.email, req.body.password)
            .then(result => {
                req.session.userId = String(result.id);
                req.session.name = result.username;
                req.session.image = result.image;
                res.redirect('/');
            })
            .catch(err => {
                // Take Error to Enter in Falsh Session
                req.flash('authError', err);
                res.redirect('/login')
            });
    } else {
        req.flash('validationErrors', validationResult(req).array());
        res.redirect('/login')
    }
};

exports.logout = (req, res) => {
    // Delete user of Session DB
    req.session.destroy(() => {
        res.redirect('/login')
    });
};