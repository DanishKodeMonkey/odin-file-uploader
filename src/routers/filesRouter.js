const express = require('express');
const router = express.Router({ mergeParams: true });

const files_controller = require('../controllers/filesController');
const { isAuthenticated, idMatcher } = require('../middleware/authMiddleware');

// Middleware to ensure user is authenticated before passing request to any routes below
router.use(isAuthenticated);
router.use(idMatcher);

/* User My files page */
// File list view
router.get('/', isAuthenticated, idMatcher, files_controller.user_files_get);

// File details view
router.get(
    '/:fileId',
    isAuthenticated,
    idMatcher,
    files_controller.user_fileDetails_get
);

// Folder view
router.get(
    '/folder/:folderId',
    isAuthenticated,
    idMatcher,
    files_controller.user_folder_get
);

// DOWNLOAD
router.get('/:fileId/download', files_controller.user_fileDownload_get);
// DELETE
router.post('/:fileId/delete', files_controller.file_delete_post);

module.exports = router;
