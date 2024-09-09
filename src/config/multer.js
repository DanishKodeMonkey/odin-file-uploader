const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = req.body.folderName || 'default';
        const userDir = path.join(
            __dirname,
            '../../public/uploads',
            req.user.username
        );
        const folderPath = path.join(userDir, folderName);
        try {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            cb(null, folderPath);
        } catch (err) {
            cb(new Error('Failed to create folder for file upload'));
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 150);
        cb(null, uniqueSuffix + '-' + file.originalname); // Add a unique suffix to file name to prevent overwrites
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

module.exports = upload;