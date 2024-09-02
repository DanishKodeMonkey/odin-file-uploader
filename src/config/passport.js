const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { userQueries } = require('../db/prismaQueries');

// set up passport with local strategy
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            // Attempt to match username
            const lowerCaseUsername = username.toLowerCase();
            const user = await userQueries.getUserByUsername(lowerCaseUsername);
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            // Attempt to match password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userQueries.getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
