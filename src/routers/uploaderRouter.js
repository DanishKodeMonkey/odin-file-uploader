const express = require('express');
const router = express.Router({ mergeParams: true });

const uploader_controller = require('../controllers/uploaderController');
const { isAuthenticated, idMatcher } = require('../middleware/authMiddleware'); // Authentication middleware

// Middleware to ensure user is authenticated before passing request to any routes below
router.use(isAuthenticated);
router.use(idMatcher);

/* Folders */
// Create new folder
router.post('/createFolder', uploader_controller.folder_create_post);

// Delete folder
router.post(
    '/folders/:folderId/delete',
    uploader_controller.folder_delete_post
);

/* Files */
// Delete
router.post('/:fileId/delete', uploader_controller.file_delete_post);
// Create
router.post('/:folderName?', uploader_controller.file_upload_post); // protected route

module.exports = router;
