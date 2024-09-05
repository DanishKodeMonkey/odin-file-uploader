const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // user is authenticated, proceed.
    }
    res.redirect('/user/login'); // User NOT authenticated, redirect to login
};

const userParser = (req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
};

module.exports = { isAuthenticated, userParser };
