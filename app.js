require('dotenv').config();

// Packages
const express = require('express');
const session = require('express-session');
const path = require('path');
// custom middleware
const { userParser } = require('./src/middleware/authMiddleware');
// Configs
const passport = require('./src/config/passport');

// Routers
const indexRouter = require('./src/routers/indexRouter');
const usersRouter = require('./src/routers/usersRouter');
const uploaderRouter = require('./src/routers/uploaderRouter');
const filesRouter = require('./src/routers/filesRouter');

const app = express();

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
// middleware parses user request object to response locals to let browser carry session along easy
app.use(userParser);

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/user/:userId/files', filesRouter);
app.use('/user/:userId/files/upload', uploaderRouter);

// Catch all route handler if nothing else matches.
app.use((req, res, next) => {
    res.status(404).render('errorPage', {
        user: res.locals.currentUser,
        err: {
            status: 404,
            title: 'Not Found',
            message: 'The page you are looking for does not exist',
        },
        description: 'Page not found',
        title: 'Page not found',
    });
});

// Generic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // parse error
    res.status(err.status || 500).render('errorPage', {
        user: res.locals.currentUser,
        err: err,
        description: 'An error occured while processing your request',
        title: 'Error Page',
    });
});

app.listen(process.env.PORT, () =>
    console.log('App listening on port ', process.env.PORT)
);
