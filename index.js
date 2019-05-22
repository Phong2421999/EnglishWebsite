require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const expressSession = require('express-session');
// const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middleware/auth.middleware');


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

const app = express();
const session = expressSession({
    key: 'userSessionId',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {}
});

// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session);
app.use(authMiddleware.hasSessionNotFoundUser);
app.use(function(req, res, next) {
    if (req.session.user)
        res.locals.user = req.session.user;
    next();
})
app.use('/auth', authRoutes);


app.set('view engine', 'ejs');
app.set('views', './views', './views/auth');


app.get('/', (req, res) => {
    res.render('index.ejs');
})

//route for 404 error
app.use((req, res, next) => {
    res.render('_404.ejs');
});

app.listen(process.env.PORT);