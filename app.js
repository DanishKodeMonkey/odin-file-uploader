require('dotenv').config();

// Packages
const express = require('express');
const session = require('express-session');
const path = require('path');
// Configs
const passport = require('./src/config/passport');

// Routers
const indexRouter = require('./src/routers/indexRouter');

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
app.use(passport.session());
// middleware parses user request object to response locals to let browser carry session along easy
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
});

app.use('/', indexRouter);

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