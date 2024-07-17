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
            {
                emit: 'event',
                level: 'query',
            },
        ],
    });

    prisma.$on('error', e => console.error(e.message));
    prisma.$on('info', e => console.log(e.message));
    prisma.$on('warn', e => console.log(e.message));
    prisma.$on('query', e => console.log(e));

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
