require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();

app.set('views', path.join(__dirname, 'views'));
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

app.get('/', (req, res) => res.render('index'));

// Catch all route handler if nothing else matches.
app.use((req, res, next) => {
    res.status(404).render('404', { message: 'Page Not Found' });
});

// Generic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // parse error
    const statusCode = err.status || 500; // set status code

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error (500)',
    });
});

app.listen(process.env.PORT, () =>
    console.log('App listening on port ', process.env.PORT)
);
