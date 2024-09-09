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
            const { title, filePath, userId } = fileData;
            const newFile = await prisma.file.create({
                data: { title, filePath, userId },
            });
            return newFile;
        } catch (err) {
            console.error('Error creating file data: ', err);
            throw new Error('Error creating file record');
        }
    },
    createFolder: async (folderData) => {
        try {
            const { name, userId } = folderData;
            const newFolder = await prisma.folder.create({
                data: {
                    name: name,
                    usersId: userId,
                },
            });
            return newFolder;
        } catch (err) {
            console.error('Error creating folder data: ', err);
            throw new Error('Error creating folder record');
        }
    },
};

module.exports = { userQueries, uploadQueries };
