const express = require('express');
const router = express.Router();

const uploader_controller = require('../controllers/uploaderController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Authentication middleware

// Middleware to ensure user is authenticated before passing request to any routes below
router.use(isAuthenticated);

/* Files */
router.get('/upload', uploader_controller.file_upload_get); // protected route

router.post('/upload', uploader_controller.file_upload_post); // protected route

/* Folders */
// Get all folders
router.get('/folders', uploader_controller.listFolders);

// Create new folder
router.post('/createFolder', uploader_controller.createFolder);

// Get folder by ID
router.get('/folders/:folderId', uploader_controller.getFolderById);

module.exports = router;
