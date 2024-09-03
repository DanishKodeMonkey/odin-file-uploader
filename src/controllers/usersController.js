const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
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
    });
});
