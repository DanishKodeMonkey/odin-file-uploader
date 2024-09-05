const asyncHandler = require('express-async-handler');
const upload = require('../config/multer');

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
