const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

// GET user sign up
router.get('/sign-up', user_controller.user_signup_get);
// POST user sign up
router.post('/sign-up', user_controller.user_signup_post);

module.exports = router;
