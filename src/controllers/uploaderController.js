const asyncHandler = require('express-async-handler');
const multer = require('multer');

const path = require('path');

// set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads')); // Files will be saved here.
    },
    filename: function (req, file, cb) {
        // Create unique filename using timestamps
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 150);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //5mb size limit
});

exports.file_upload_get = asyncHandler(async (req, res) => {
    console.log('Hit file upload GET');
    res.render('pages/upload', {
        description: 'Upload page',
        title: 'Upload file',
        errors: [],
        user: res.locals.currentUser,
    });
});

exports.file_upload_post = [
    upload.single('uploaded_file'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).render('pages/upload', {
                description: 'Upload page',
                title: 'Upload file',
                errors: [{ msg: 'Please upload a file' }],
                user: res.locals.currentUser,
            });
        }
        console.log('File uploaded successfully: ', req.file);
        console.log('Form data: ', req.body);
        res.redirect('/');
    }),
];
