const asyncHandler = require('express-async-handler');
const upload = require('../config/multer');
const { uploadQueries } = require('../db/prismaQueries');

/* File */
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
        // Save file details to database
        try {
            const filePath = req.file.path;
            const fileTitle = req.file.originalname;

            // use locals currentuser userId to tie file to profile in database
            const newFile = await uploadQueries.createFile({
                title: fileTitle,
                filePath: filePath,
                userId: res.locals.currentUser.id, // associate with uploader id
            });
            console.log('File uploaded successfully: ', req.file);
            console.log('Database record created: ', newFile);

            res.redirect('/');
        } catch (err) {
            console.error('Error saving file to database: ', err);
            return res.status(500).render('pages/upload', {
                description: 'Upload page',
                title: 'Upload file',
                errors: [{ msg: 'Failed to save file information' }],
                user: res.locals.currentUser,
            });
        }
    }),
];

/* Folder */

// create folder
exports.createFolder = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    // Create folder reference in db
    const folder = await Prisma.folder.create({
        data: {
            name,
            userId,
        },
    });

    // create directory on server
    const fs = require('fs');
    const path = require('path');
    const userDir = path.join(
        __dirname,
        '../../public/uploads',
        req.user.username
    );
    const folderPath = path.join(userDir, name);

    // Folder not found
    if (fs.existsSync(folderPath)) {
        // Create parent folder if needed (recursive)
        fs.mkdirSync(folderPath, { recursive: true });
    }
    res.status(201).json(folder);
});
