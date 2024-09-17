const asyncHandler = require('express-async-handler');
const upload = require('../config/multer');
const { uploadQueries } = require('../db/prismaQueries');

/* File */
exports.file_upload_post = [
    upload.single('uploaded_file'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ msg: 'please select a file' });
        }

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

        // Save file details to database
        try {
            const filePath = folderName
                ? `${res.locals.currentUser.username}/${folderName}/${req.file.filename}`
                : `${res.locals.currentUser.username}/default/${req.file.filename}`;
            console.log('Saved filePath: ', filePath);
            const fileTitle = req.file.originalname;
            console.log('Saved fileTitle', fileTitle);

            // use locals currentuser userId to tie file to profile in database
            const newFile = await uploadQueries.createFile({
                title: fileTitle,
                filePath: filePath,
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

exports.file_delete_post = asyncHandler(async (req, res) => {
    // extract nessecary data for querying
    const { userId, fileId } = req.params;

    console.warn(`REACHED FILE DELETE POST FOR USER ${userId}, FILE ${fileId}`);
    // import file services
    const fs = require('fs');
    const path = require('path');
    try {
        // fetch file details from database
        const file = await uploadQueries.getFileByFileId(fileId);
        console.log('Starting operation against ', file.filePath);
        // Ensure file exists and belongs to authenticated user
        if (!file || file.userId !== parseInt(userId, 10)) {
            return res
                .status(403)
                .json({ msg: 'Unauthorized or file not found.' });
        }

        // Ready to remove file
        const filePath = path.join(
            __dirname,
            '../../public/uploads',
            file.filePath
        );
        console.log('Trying to delete filePath: ', filePath);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file from file system: ', err);
                return res
                    .status(500)
                    .json({ msg: 'Error deleting file from server.' });
            }
        });
        // Delete file references from DB
        await uploadQueries.deleteFileById(fileId, userId);

        res.redirect(`/user/${userId}/files`);
    } catch (err) {
        console.error('Error deleting file: ', err);
        res.status(500).json({ msg: 'Error deleting file' });
    }
});

/* Folders */

// create folder
exports.folder_create_post = asyncHandler(async (req, res) => {
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
        : `${name}`;

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
            filePath: `${req.user.username}/${userPath}`,
        });
        res.redirect(`/user/${res.locals.currentUser.id}/files`);
    } catch (err) {
        console.error('Error creating folder in database ', err);
        res.status(500).json({ error: 'Failed to create folder' });
    }
});

// Delete folder
exports.folder_delete_post = asyncHandler(async (req, res) => {
    const { folderId, userId } = req.params;
    const fs = require('fs');
    const path = require('path');

    try {
        // Fetch folder and files
        const folder = await uploadQueries.getFolderById(folderId);

        if (!folder) {
            return res.status(404).json({ msg: 'Folder not found' });
        }

        if (folder.usersId !== parseInt(userId, 10)) {
            return res.status(403).json({ msg: 'Unauthorized action' });
        }
        const sysDir = path.join(__dirname, '../../public/uploads');
        // Delete all files in the folder on server
        for (const file of folder.files) {
            const filePath = path.join(sysDir, file.filePath);
            console.log('Deleting path on server: ', filePath);
            // if file exists, delete.
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete all file references on db related to folder
        await uploadQueries.deleteFileByFolderId(folderId, userId);

        // Finally, delete folder
        // Sysdrive folder
        const folderDir = path.join(sysDir, folder.filePath);
        console.log('Trying to delete folder: ', folderDir);
        if (fs.existsSync(folderDir)) {
            console.log('Folder found, deleting.');
            fs.rmSync(folderDir, { recursive: true, force: true });
        }
        // db reference.
        await uploadQueries.deleteFolderById(folderId, userId);

        res.redirect(`/user/${userId}/files`);
    } catch (err) {
        console.error('Error deleting folder: ', err);
        res.status(500).json({ msg: 'Error deleting folder' });
    }
});

// list all folders
exports.folder_list_get = asyncHandler(async (req, res) => {
    try {
        const folders = await uploadQueries.getFoldersByUserId(req.user.id);
        res.status(200).json(folders);
    } catch (err) {
        console.error('Error retrieving folders:, ', err);
        res.status(500).json({ msg: 'Failed to retrieve folders' });
    }
});

exports.folder_get = asyncHandler(async (req, res) => {
    const { folderId } = req.params;
    try {
        const folder = await uploadQueries.getFolderById(
            parseInt(folderId, 10)
        );
        if (!folder) {
            return res.status(404).json({ msg: 'Folder not found' });
        }
        res.status(200).json(folder);
    } catch (err) {
        console.error('Error retrieving folder by ID:', err);
        res.status(500).json({ msg: 'Failed to retrieve folder' });
    }
});
