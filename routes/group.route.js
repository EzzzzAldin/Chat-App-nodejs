const router = require("express").Router();
const bodyParser = require("body-parser");

const authGuard = require('./guards/auth.guard');
const groupController = require('../controllers/group.controller');

router.get("/", authGuard.isAuth, groupController.getUserGroups);

router.get('/create', authGuard.isAuth, groupController.getCreateGroup);

router.post('/create', authGuard.isAuth, bodyParser.urlencoded({extended: true}), groupController.postCreateGroup);

router.get('/:id', authGuard.isAuth, groupController.getGroup);



module.exports = router;

