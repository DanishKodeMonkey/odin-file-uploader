const asyncHandler = require('express-async-handler');
const { filesQueries } = require('../db/prismaQueries');
const formatFileSize = require('../utils/helpers');

/* User "My files" page */
/* My files page */
exports.user_files_get = asyncHandler(async (req, res) => {
    console.log('Hit My files GET');
    console.log('Fetching folders');
    try {
        const folders = await filesQueries.getFoldersByUserId(req.user.id);
        const files = await filesQueries.getFilesByUserId(req.user.id);

        res.render('pages/userFiles', {
            description: 'My files page',
            title: 'My files page',
            user: res.locals.currentUser,
            folders: folders || [],
            files: files || [],
            error: null,
        });
    } catch (err) {
        console.error('Error retrieving files and folders', err);
        res.render('pages/userFiles', {
            description: 'My files page',
            title: 'My files page',
            user: res.locals.currentUser,
            folders: [],
            files: [],
            error: [{ msg: 'Error retrieving files or folders' }],
        });
    }
});

// Get user folder with contents
exports.user_folder_get = asyncHandler(async (req, res) => {
    console.log('Hit folder view GET');
    const folderId = req.params.folderId;

    try {
        const folder = await filesQueries.getFolderById(folderId);
        console.log(folder);
        res.render('pages/folderView', {
            description: 'Folder view',
            title: 'Folder view',
            user: res.locals.currentUser,
            folders: folder,
            files: folder.files,
            folderName: folder.name,
            error: null,
        });
    } catch (err) {
        console.error('Error retrieving folder...', err);
        res.render('pages/folderView', {
            description: 'Folder view',
            title: 'Folder view',
            user: res.locals.currentUser,
            folders: [],
            files: [],
            error: [{ msg: 'Error retrieving folder...' }],
        });
    }
});

exports.user_fileDetails_get = asyncHandler(async (req, res) => {
    console.log('Hit file details view GET for, ', req.params.fileId);
    const fileId = req.params.fileId;

    try {
        const file = await filesQueries.getFileByFileId(fileId);

        // Format file size using helper utility
        file.size = formatFileSize(file.size);

        console.log(file);
        res.render('pages/fileDetailsView', {
            title: 'File details view',
            description: 'File details view',
            user: res.locals.currentUser,
            file: file,
            error: null,
        });
    } catch (err) {
        console.error('Error retrieving file...', err);
        res.render('pages/fileDetailsView', {
            title: 'File details view',
            description: 'File details view',
            user: res.locals.currentUser,
            file: file,
            error: [{ msg: 'Error retrieving file...' }],
        });
    }
});
