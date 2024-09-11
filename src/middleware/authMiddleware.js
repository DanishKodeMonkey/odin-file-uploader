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

const idMatcher = (req, res, next) => {
    console.log(
        'Checking ids...',
        req.params.userId,
        ' against ',
        res.locals.currentUser.id
    );
    if (
        parseInt(req.params.userId, 10) !==
        parseInt(res.locals.currentUser.id, 10)
    ) {
        return res
            .status(401)
            .json({ message: 'Unauthorized access. User mismatch.' });
    }
    next();
};

module.exports = { isAuthenticated, userParser, idMatcher };
