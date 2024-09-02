// Prisma client centralisation including configuration and middleware

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
    ],
});

// Query logging middleware
prisma.$on('query', (e) => {
    console.log(`[${new Date().toISOString()}] Query:`, e.query);
    console.log(`[${new Date().toISOString()}] Params:`, e.params);
    console.log(`[${new Date().toISOString()}] Duration:`, e.duration + 'ms');
});

// Graceful application shutdown
function handleShutdown(signal) {
    console.log(
        `Received ${signal}. Closing Prisma Client and shutting down...`
    );
    prisma.$disconnect().finally(() => {
        process.exit(0);
    });
}

// Handle termination signals
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

module.exports = prisma;
