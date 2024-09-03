const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { userQueries } = require('../db/prismaQueries');

// Validation for signup
const validateUser = [
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

exports.user_signup_get = asyncHandler(async (req, res) => {
    res.render('pages/signup', {
        description: 'Sign up page',
        title: 'Sign up',
        errors: [],
        user: {},
    });
});

exports.user_signup_post = [
    // validate and sanitize user data
    ...validateUser,

    // handle result errors:
    asyncHandler(async (req, res) => {
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
            res.redirect('/user/sign-in');
        } catch (err) {
            console.error('Error creating user;', err);
            throw err;
        }
    }),
];
