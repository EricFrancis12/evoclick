import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    const prisma = new PrismaClient({
        log: [
            {
                emit: 'event',
                level: 'error',
            },
            {
                emit: 'event',
                level: 'info',
            },
            {
                emit: 'event',
                level: 'warn',
            },
        ],
    });

    if (process.env.NODE_ENV !== "test" // Prevents logs during tests
        && process.env.NEXT_PHASE !== "phase-production-build" // Prevents logs during next build
    ) {
        prisma.$on('error', e => console.error(e.message));
        prisma.$on('info', e => console.log(e.message));
        prisma.$on('warn', e => console.log(e.message));
    }

    return prisma;
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton();
export default db;

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = db;
}
