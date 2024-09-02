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
};

module.exports = { userQueries };
