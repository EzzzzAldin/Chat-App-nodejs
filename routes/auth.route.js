const router = require('express').Router();
const bodyParser = require('body-parser');
// Init express-validtor
const check = require('express-validator').check;
// Init Module multer To work Form type multipart
const multer = require('multer');

const authGuard = require('./guards/auth.guard');
const authController = require('../controllers/auth.controller');

router.get('/signup', authGuard.notAuth, authController.getSignup);
router.post('/signup', authGuard.notAuth, bodyParser.urlencoded({extended: true}),
    multer({
        storage: multer.diskStorage({
        //  Propartiy to location upload
        destination: (req, file, cb) => {
            // Name Location upload Images
            cb(null, 'images');
        },
        filename: (req, file, cb) => {
            // To Show Picture in Files Images It is not encrypted or duplicated
            cb(null, Date.now() + '-' + file.originalname)
        }
        })
    }).single('image'),
    // Check UserName is Not Requird
    check('username')
        .not()
        .isEmpty(),
    // Check Email
    check('email')
        .not()
        .isEmpty()
        .withMessage('E-mail is required')
        .isEmail()
        .withMessage('Invalid Format'),
    // Check Password
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characheter'),
    // Check Vaild Confirm Password
    check('confiremPassword').custom((value, {req} ) => {
        // Compare password equal confirm Password
        if( value === req.body.password) return true
        else throw 'passwords are not same';
    }),
    authController.postSignup
);

router.get('/login', authGuard.notAuth, authController.getLogin);
router.post('/login', authGuard.notAuth, bodyParser.urlencoded({extended: true}),
    // Check Email
    check('email')
        .not()
        .isEmpty()
        .withMessage('E-mail is required')
        .isEmail()
        .withMessage('Invalid Format'),
    // Check Password
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characheter'),
    authController.postLogin
);

router.all('/logout', authGuard.isAuth, authController.logout);

module.exports = router;