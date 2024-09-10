const express = require('express');
const router = express.Router();

const uploader_controller = require('../controllers/uploaderController');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Authentication middleware

/* Files */
router.get('/upload', isAuthenticated, uploader_controller.file_upload_get); // protected route

router.post('/upload', isAuthenticated, uploader_controller.file_upload_post); // protected route

/* Folders */
// Get all folders
router.get('/folders', isAuthenticated, uploader_controller.listFolders);

// Create new folder
router.post('/createFolder', isAuthenticated, uploader_controller.createFolder);

// Get folder by ID
router.get(
    '/folders/:folderId',
    isAuthenticated,
    uploader_controller.getFolderById
);
module.exports = router;
