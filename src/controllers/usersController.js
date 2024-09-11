const asyncHandler = require('express-async-handler');
const passport = require('../config/passport');
const { body, validationResult } = require('express-validator');
const { userQueries, uploadQueries } = require('../db/prismaQueries');
const { idMatcher } = require('../middleware/authMiddleware');

// User validation
const validateUserSignup = [
    body('username')
        .trim()
        .escape()
        .isLength({ min: 1, max: 20 })
        .withMessage('Username must be between 1 and 20 characters')
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric'),
    body('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Invalid email address.'),
    body('password')
        .isLength({ min: 6, max: 60 })
        .withMessage('Please keep passwords between 6 and 60 characters'),
];

const validateUserLogin = [
    body('username')
        .trim()
        .escape()
        .isLength({ min: 1, max: 20 })
        .withMessage('Username must be between 1 and 20 characters')
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric'),
    body('password')
        .isLength({ min: 6, max: 60 })
        .withMessage('Please keep passwords between 6 and 60 characters'),
];

// signup
// GET
exports.user_signup_get = asyncHandler(async (req, res) => {
    console.log('hit user signup GET');
    res.render('pages/signup', {
        description: 'Sign up page',
        title: 'Sign up',
        errors: [],
        user: {},
    });
});

// POST
exports.user_signup_post = [
    // validate and sanitize user data
    ...validateUserSignup,

    // handle result errors:
    asyncHandler(async (req, res) => {
        console.log('hit user signup POST');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('pages/signup', {
                description: 'Sign up page',
                title: 'Sign up',
                errors: errors.array(),
                user: req.body,
            });
        }
        // No errors, proceed
        // Extract sanitized values
        const { username, email, password } = req.body;

        // check for existing user
        const existingUser = await userQueries.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).render('pages/signup', {
                description: 'Sign up page',
                title: 'Sign up',
                errors: [{ msg: 'Email already exists' }],
                users: req.body,
            });
        }

        // No existing user, send to prismaQueries for creation
        try {
            await userQueries.createUser({
                username: username.toLowerCase(),
                email: email,
                password: password,
            });
            res.redirect('/user/login');
        } catch (err) {
            console.error('Error creating user;', err);
            throw err;
        }
    }),
];

// Login
// GET
exports.user_login_get = asyncHandler(async (req, res) => {
    console.log('Hit user login GET');
    res.render('pages/login', {
        description: 'Login page',
        title: 'Login',
        errors: [],
        user: {},
    });
});

// POST
exports.user_login_post = [
    // Validate user data
    ...validateUserLogin,

    // Handle errors
    asyncHandler(async (req, res, next) => {
        console.log('Hit user login POST');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('ERROR LOGIN');
            return res.status(400).render('pages/login', {
                description: 'Login page',
                title: 'Login',
                errors: errors.array(),
                user: req.body,
            });
        }
        console.log('Authenticating...');
        // No errors, proceed
        passport.authenticate('local', (err, user, info) => {
            // Error authenticating user
            if (err) {
                console.error('Error authenticating', err);
                return next(err);
            }
            // User not found
            if (!user) {
                console.error('User not found');
                return res.status(400).render('pages/login', {
                    description: 'Login page',
                    title: 'Login',
                    errors: [{ msg: info.message }],
                    user: req.body,
                });
            }
            // Authentication successful, establish session.
            console.log('Authentication succesful, establishing session');
            req.logIn(user, (err) => {
                if (err) {
                    console.error('Faied to establish session', err);
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    }),
];

// LOGOUT
// GET
exports.user_logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

/* User "My files" page */
/* My files page */
exports.user_files_get = asyncHandler(async (req, res) => {
    console.log('Hit My files GET');
    console.log('Fetching folders');
    try {
        const folders = await uploadQueries.getFoldersByUserId(req.user.id);
        const files = await uploadQueries.getFilesByUserId(req.user.id);

        console.log('Done fetching data, rendering page...');
        console.log(files);
        console.log(folders);
        res.render('pages/userFiles', {
            description: 'My files page',
            title: 'My files page',
            user: res.locals.currentUser,
            folders: folders || [],
            files: files || [],
            error: null,
        });
    } catch (err) {
        console.error('Error retrieving files and folders', err);
        res.render('pages/userFiles', {
            description: 'My files page',
            title: 'My files page',
            user: res.locals.currentUser,
            folders: [],
            files: [],
            error: [{ msg: 'Error retrieving files or folders' }],
        });
    }
});
