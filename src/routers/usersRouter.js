const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/usersController');
const { isAuthenticated, idMatcher } = require('../middleware/authMiddleware');

// user sign up
// GET
router.get('/sign-up', user_controller.user_signup_get);
// POST
router.post('/sign-up', user_controller.user_signup_post);

// user sign in
// GET
router.get('/login', user_controller.user_login_get);
// POST
router.post('/login', user_controller.user_login_post);

// user sign out
// GET
router.get('/logout', user_controller.user_logout);

/* User My files page */
router.get(
    '/:userId/files',
    isAuthenticated,
    idMatcher,
    user_controller.user_files_get
);

module.exports = router;
