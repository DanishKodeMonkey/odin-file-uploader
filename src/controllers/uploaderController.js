const asyncHandler = require('express-async-handler');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');
const { uploadQueries } = require('../db/prismaQueries');
const fs = require('fs');
const path = require('path');
const { folder } = require('../db/prismaClient');

/* File */
exports.file_upload_post = [
    upload.single('uploaded_file'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ msg: 'please select a file' });
        }

        // Generate filename
        const file = req.file;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 150);
        const generatedFilename = `${uniqueSuffix}-${file.originalname}`;
        const fileBuffer = file.buffer;
        const fileMimeType = file.mimetype;

        const userName = res.locals.currentUser.username;

        let folderId = null; //default null folderId if no foldername is provided
        let folderName = null;
        if (req.params.folderName) {
            const folder = await uploadQueries.getFolderByName(
                req.params.folderName,
                res.locals.currentUser.id
            );
            if (folder) {
                folderId = folder.id;
                folderName = folder.name;
            }
        }

        try {
            // generate base64 encoding of file
            const base64EncodedImage =
                Buffer.from(fileBuffer).toString('base64');
            const dataUri = `data:${fileMimeType};base64,${base64EncodedImage}`;

            // save file to cloudinary
            const uploadResult = await cloudinary.uploader.upload(dataUri, {
                public_id: generatedFilename,
                folder: folderName
                    ? `${userName}/${folderName}`
                    : `${userName}/default`,
            });

            console.log(uploadResult.public_id);

            // Save file details to database
            const filePath = folderName
                ? `${res.locals.currentUser.username}/${folderName}/${file.originalname}`
                : `${res.locals.currentUser.username}/default/${file.originalname}`;
            console.log('Saved filePath: ', filePath);
            const fileTitle = req.file.originalname;
            console.log('Saved fileTitle', fileTitle);

            // use locals currentuser userId to tie file to profile in database
            const newFile = await uploadQueries.createFile({
                public_id: uploadResult.public_id,
                title: fileTitle,
                filePath: filePath,
                size: file.size,
                userId: res.locals.currentUser.id, // associate with uploader id
                folderId: folderId,
            });
            console.log('File uploaded successfully: ', req.file);
            console.log('Database record created: ', newFile);

            res.redirect(`/user/${res.locals.currentUser.id}/files`);
        } catch (err) {
            console.error('Error saving file to database: ', err);
            return res.status(500).json({ msg: 'Failed to upload file' });
        }
    }),
];

/* Folders */

// create folder
exports.folder_create_post = asyncHandler(async (req, res) => {
    // desired name of folder
    const { name, parentFolderPath } = req.body;

    // create directory on server
    // User directory on server
    const userDir = res.locals.currentUser.username;

    // Generate user path for relative path for database
    const userPath = parentFolderPath
        ? `${parentFolderPath}/${name}`
        : `${name}`;

    // folder path on user directory
    const folderPath = path.join(userDir, userPath);

    // user directory not found
    try {
        await cloudinary.api.create_folder(folderPath);
    } catch (err) {
        console.error('ERror creating folder on cloudinary');
        throw new Error('Failed to create folder on cloudinary');
    }

    try {
        const newFolder = await uploadQueries.createFolder({
            name: name,
            userId: res.locals.currentUser.id,
            filePath: folderPath,
        });
        res.redirect(`/user/${res.locals.currentUser.id}/files`);
    } catch (err) {
        console.error('Error creating folder in database ', err);
        res.status(500).json({ error: 'Failed to create folder' });
    }
});
