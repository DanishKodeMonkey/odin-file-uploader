const express = require('express');
const router = express.Router();

const uploader_controller = require('../controllers/uploaderController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Authentication middleware

router.get('/upload', isAuthenticated, uploader_controller.file_upload_get); // protected route

router.post('/upload', isAuthenticated, uploader_controller.file_upload_post); // protected route

module.exports = router;
