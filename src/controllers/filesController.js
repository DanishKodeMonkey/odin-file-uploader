const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const { filesQueries } = require('../db/prismaQueries');
const formatFileSize = require('../utils/helpers');
const path = require('path');
const fs = require('fs');

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

exports.user_fileDownload_get = asyncHandler(async (req, res) => {
    console.log('Starting download operation');
    try {
        const fileId = parseInt(req.params.fileId, 10);
        console.log('File ID: ', fileId);

        // fetch file metadata from database
        const file = await filesQueries.getFileByFileId(fileId);

        if (!file) {
            return res.status(404).json({ msg: 'File not found' });
        }
        console.log('File: ', file);

        // retrieve files cloudinary public_id
        const { public_id, resource_type, type } = file;

        // Download file using Cloudinary's API
        const downloadUrl = cloudinary.url(public_id, {
            resource_type: resource_type || 'raw',
            type: type,
            flags: 'attachment', // Force download
        });

        res.redirect(downloadUrl);
    } catch (err) {
        console.error('Error fetching file: ', err);
        res.status(500).json({ msg: 'Failed to download file' });
    }
});

// Delete file

exports.file_delete_post = asyncHandler(async (req, res) => {
    // extract nessecary data for querying
    const { userId, fileId } = req.params;

    console.warn(`REACHED FILE DELETE POST FOR USER ${userId}, FILE ${fileId}`);
    // import file services

    try {
        // fetch file details from database
        const file = await filesQueries.getFileByFileId(fileId);
        console.log('Starting operation against ', file.filePath);
        // Ensure file exists and belongs to authenticated user
        if (!file || file.userId !== parseInt(userId, 10)) {
            return res
                .status(403)
                .json({ msg: 'Unauthorized or file not found.' });
        }

        // Ready to remove file

        console.log('Trying to delete filePath: ', file.public_id);
        const cloudinaryPublicId = file.public_id;
        await cloudinary.uploader.destroy(cloudinaryPublicId);

        // Delete file references from DB
        await filesQueries.deleteFileById(fileId, userId);

        res.redirect(`/user/${userId}/files`);
    } catch (err) {
        console.error('Error deleting file: ', err);
        res.status(500).json({ msg: 'Error deleting file' });
    }
});

// Delete folder WITH FILES
exports.folder_delete_post = asyncHandler(async (req, res) => {
    const { folderId, userId } = req.params;

    try {
        // Fetch folder and files
        const folder = await filesQueries.getFolderById(folderId);

        if (!folder) {
            return res.status(404).json({ msg: 'Folder not found' });
        }

        if (folder.usersId !== parseInt(userId, 10)) {
            return res.status(403).json({ msg: 'Unauthorized action' });
        }
        // delete all files in the folder from cloudinary
        for (const file of folder.files) {
            const publicId = file.public_id;
            console.log('Delete file in folder ', publicId);
            await cloudinary.uploader.destroy(publicId, { invalidate: true });
        }

        const folderPath = folder.filePath;
        console.log('Deleting folder from cloudinary: ', folderPath);
        try {
            await cloudinary.api.delete_folder(folderPath);
        } catch (err) {
            console.error('Error deleting folder from cloudinary', err);
            return res
                .status(500)
                .json({ msg: 'Failed to delete the folder from cloudinary' });
        }

        // Delete all file references on db related to folder
        await filesQueries.deleteFileByFolderId(folderId, userId);

        // Finally, delete folder from DB

        await filesQueries.deleteFolderById(folderId, userId);

        res.redirect(`/user/${userId}/files`);
    } catch (err) {
        console.error('Error deleting folder: ', err);
        res.status(500).json({ msg: 'Error deleting folder' });
    }
});
