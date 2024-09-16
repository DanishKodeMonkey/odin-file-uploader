const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

const userQueries = {
    getUserById: async (userId) => {
        try {
            const user = await prisma.users.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new Error(`User with ID ${userId} not found.`);
            }
            return user;
        } catch (err) {
            console.error('Error retrieving user by ID: ', err);
            throw new Error('Error retrieving user by ID');
        }
    },
    getUserByUsername: async (username) => {
        try {
            const user = await prisma.users.findFirst({
                where: { username: username },
            });

            if (!user) {
                throw new Error(`User with username ${username} not found.`);
            }
            return user;
        } catch (err) {
            console.error('Error retrieving user by name: ', err);
            return null;
        }
    },
    getUserByEmail: async (email) => {
        try {
            const user = await prisma.users.findUnique({
                where: { email: email },
            });
            return user;
        } catch (err) {
            console.error('Error retrieving user by Email: ', err);
            throw new Error('Error retrieving user by Email');
        }
    },
    createUser: async (userData) => {
        try {
            const { username, email, password } = userData;
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // create new user
            const newUser = await prisma.users.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                },
            });
            return newUser;
        } catch (err) {
            console.error('Error creating user ', err);
            throw new Error('Error creating user');
        }
    },
};

const uploadQueries = {
    createFile: async (fileData) => {
        try {
            const { title, filePath, userId, folderId } = fileData;
            const newFile = await prisma.file.create({
                data: {
                    title: title,
                    filePath: filePath,
                    userId: userId,
                    folderId: folderId || null,
                },
            });
            return newFile;
        } catch (err) {
            console.error('Error creating file data: ', err);
            throw new Error('Error creating file record');
        }
    },
    deleteFileById: async (fileId, userId) => {
        try {
            return await prisma.file.delete({
                where: {
                    id: parseInt(fileId, 10),
                    userId: parseInt(userId, 10),
                },
            });
        } catch (err) {
            console.error('Error deleting file from database: ', err);
            throw new Error('Error deleting file');
        }
    },
    createFolder: async (folderData) => {
        try {
            const { name, userId, filePath } = folderData;
            const newFolder = await prisma.folder.create({
                data: {
                    name: name,
                    usersId: userId,
                    filePath: filePath,
                },
            });
            return newFolder;
        } catch (err) {
            console.error('Error creating folder data: ', err);
            throw new Error('Error creating folder record');
        }
    },
    getFileByFileId: async (fileId) => {
        try {
            return await prisma.file.findUnique({
                where: { id: parseInt(fileId, 10) },
            });
        } catch (err) {
            console.error('Error retrieving file by ID: ', err);
            throw new Error('Error retrieving file by ID');
        }
    },
    getFilesByUserId: async (userId) => {
        try {
            return await prisma.file.findMany({
                where: { userId: userId, folderId: null },
            });
        } catch (err) {
            console.error('Error retrieving files: ', err);
            throw new Error('Error retrieving files');
        }
    },
    getFoldersByUserId: async (usersId) => {
        try {
            return await prisma.folder.findMany({
                where: { usersId: usersId },
            });
        } catch (err) {
            console.error('Error retrieving folders: ', err);
            throw new Error('Error retrieving folders');
        }
    },
    getFolderById: async (folderId) => {
        try {
            return await prisma.folder.findUnique({
                where: { id: parseInt(folderId, 10) },
                include: { files: true },
            });
        } catch (err) {
            console.error('Error retrieving folder by Id:', err);
            throw new Error('Error retrieving folder by ID');
        }
    },
    getFolderByName: async (folderName, userId) => {
        try {
            return await prisma.folder.findFirst({
                where: { name: folderName, usersId: userId },
                include: { files: true },
            });
        } catch (err) {
            console.error('Error retrieving folder by name: ', err);
            throw new Error('Error retrieving folder by name');
        }
    },
};

module.exports = { userQueries, uploadQueries };
