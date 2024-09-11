const asyncHandler = require('express-async-handler');
const upload = require('../config/multer');
const { uploadQueries } = require('../db/prismaQueries');

/* File */
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

/* Folders */

// create folder
exports.createFolder = asyncHandler(async (req, res) => {
    // desired name of folder
    const { name, parentFolderPath } = req.body;

    // create directory on server
    const fs = require('fs');
    const path = require('path');
    // User directory on server
    const userDir = path.join(
        __dirname,
        '../../public/uploads',
        req.user.username
    );
    // Generate user path for relative path for database
    const userPath = parentFolderPath
        ? `${parentFolderPath}/${name}`
        : `${req.user.username}/${name}`;

    // folder path on user directory
    const folderPath = path.join(userDir, userPath);

    // user directory not found
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }
    // Folder not found
    if (!fs.existsSync(folderPath)) {
        // Create parent folder if needed (recursive)
        fs.mkdirSync(folderPath, { recursive: true });
    } else {
        return res.status(400).json({ error: 'Folder already exists' });
    }

    try {
        const newFolder = await uploadQueries.createFolder({
            name: name,
            userId: res.locals.currentUser.id,
            filePath: userPath,
        });
        return newFolder;
    } catch (err) {
        console.error('Error creating folder in database ', err);
        res.status(500).json({ error: 'Failed to create folder' });
    }
});

// list all folders
exports.listFolders = asyncHandler(async (req, res) => {
    try {
        const folders = await uploadQueries.getFoldersByUserId(req.user.id);
        res.status(200).json(folders);
    } catch (err) {
        console.error('Error retrieving folders:, ', err);
        res.status(500).json({ message: 'Failed to retrieve folders' });
    }
});

exports.getFolderById = asyncHandler(async (req, res) => {
    const { folderId } = req.params;
    try {
        const folder = await uploadQueries.getFolderById(
            parseInt(folderId, 10)
        );
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.status(200).json(folder);
    } catch (err) {
        console.error('Error retrieving folder by ID:', err);
        res.status(500).json({ message: 'Failed to retrieve folder' });
    }
});
