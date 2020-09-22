//  Init Dotenv
require('dotenv').config();

const express = require('express');
const path =  require('path');

// Require Session
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
// Init Socket.Io
const socketIO = require('socket.io');

// Router
const authRouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const FriendRouter = require('./routes/friend.route');
const homeRouter = require('./routes/home.route');
const chatRouter = require('./routes/chat.route');
const groupRouter = require('./routes/group.route');

// Function Frind Request in user Model to use in Friend Request DropDowen
const getFriendRequests = require('./models/user.model').getFriendRequests;

// Server Express
const app = express();
// Init Server HTTP 
const server = require('http').createServer(app);

// Run SocketIo
const io = socketIO(server);

// Check User Online
io.onlineUsers = {};
// Event Friend Request
require('./sockets/friend.socket')(io);
// Get Finction Listen Notifications Room
require('./sockets/init.socket')(io);
// Get Finction Listhen Chat Socket
require('./sockets/chat.socket')(io);
// Get Finction Listhen Group Socket
require('./sockets/group.socket')(io);

// Init Static Files
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));
// Init Flash Sessions
app.use(flash());

// Init Session Store
const STORE = new SessionStore({
    uri:'mongodb+srv://EzzAldin:Naruto74@cluster0.cufwz.mongodb.net/chat-app?retryWrites=true&w=majority',
    collection: 'sessions'
});
app.use(session({
    secret: 'Naruto and luffy and ichego and medoria and gon and ocuby and many chatcter the best hero',
    saveUninitialized: false,
    store: STORE
}));

// Init ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// Port Init
const PORT = process.env.PORT || 3000;

// DropDown Friend Requests
app.use((req, res, next) => {
    // Check User
    if (req.session.userId) {
        getFriendRequests(req.session.userId).then(requests => {
            // To sharing Data Of next MidelWare
            req.friendRequests = requests;
            next();

        }).catch(err => res.redirect('/error'))
    } else {
        next();
    }
});

// Router Use
app.use('/', authRouter);
app.use('/', homeRouter);
app.use('/profile', profileRouter);
app.use('/friend', FriendRouter);
app.use('/chat', chatRouter);
app.use('/groups', groupRouter);

// MidelWare Errors
app.get("/error", (req, res, next) => {
    res.status(500);
    res.render("error.ejs", {
        isUser: req.session.userId,
        pageTitle: "Error",
        friendRequests: req.friendRequests
    });
});

app.use((req, res, next) => {
    res.status(404);
    res.render("not-found", {
        isUser: req.session.userId,
        pageTitle: "Page Not Found",
        friendRequests: req.friendRequests
    });
});

server.listen(PORT, () => {
    console.log(`Server run on Port ${PORT}`);
});