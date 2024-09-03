const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

// GET user page
router.get('/sign-up', user_controller.signUpGet);

module.exports = router;
