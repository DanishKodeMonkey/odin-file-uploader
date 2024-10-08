const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

module.exports = upload;
