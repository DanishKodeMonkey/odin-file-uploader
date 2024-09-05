const asyncHandler = require('express-async-handler');
const multer = require('multer');
const upload = multer({ dest: '../../uploads/' });

exports.file_upload_get = asyncHandler(async (req, res) => {
    console.log('Hit file upload GET');
    res.render('pages/upload', {
        description: 'Upload page',
        title: 'Upload file',
        errors: [],
        user: {},
    });
});

(exports.file_upload_post = upload.single('file')),
    function (req, res, next) {};
