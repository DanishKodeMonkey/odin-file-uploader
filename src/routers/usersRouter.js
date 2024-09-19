const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/usersController');

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

module.exports = router;
