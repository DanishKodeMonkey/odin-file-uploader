require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// middleware parses user request object to response locals to let browser carry session along easy
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
});

app.get('/', (req, res) => res.render('index'));

app.listen(process.env.PORT, () =>
    console.log('App listening on port ', process.env.PORT)
);
