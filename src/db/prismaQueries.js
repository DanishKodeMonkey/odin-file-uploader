const prisma = require('./prismaClient');

const userQueries = {
    getUserById: async (userId) => {
        try {
            const user = await prisma.user.findUnique({
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
            const user = await prisma.user.findUnique({
                where: { username: username },
            });

            if (!user) {
                throw new Error(`User with username ${username} not found.`);
            }
            return user;
        } catch (err) {
            console.error('Error retrieving user by name: ', err);
            throw new Error('Error retrieving user by username');
        }
    },
    getUserByEmail: async (email) => {
        try {
            const user = await prisma.user.findFirst({
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
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // create new user
            const newUser = await prisma.user.create({
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

module.exports = { userQueries };
