const router = require('express').Router();
const bodyParser = require('body-parser');

const authGuard = require('./guards/auth.guard');
const friendController = require('../controllers/friend.controller');

router.post('/cancel', authGuard.isAuth, bodyParser.urlencoded({extended: true}), friendController.cancel);

router.post('/accept', authGuard.isAuth, bodyParser.urlencoded({extended: true}), friendController.accept);

router.post('/reject', authGuard.isAuth, bodyParser.urlencoded({extended: true}), friendController.reject);

router.post('/delete', authGuard.isAuth, bodyParser.urlencoded({extended: true}), friendController.delete);



module.exports = router;