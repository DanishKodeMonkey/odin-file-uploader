const express = require('express');
const router = express.Router();

const uploader_controller = require('../controllers/uploaderController');

router.get('/upload', uploader_controller.file_upload_get);

router.post('/upload', uploader_controller.file_upload_post);

module.exports = router;
