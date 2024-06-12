// Do not use the "@/" syntax when importing prisma here
// because the seed command "npx prisma db seed" uses ts-node under the hood,
// and it's not able to recognize that syntax in the current tsconfig.
import prisma from '../src/lib/db';

const links = [
    {
        category: "Open Source",
        description: "Fullstack React framework",
        id: 1,
        imageUrl: "https://github.com/vercel.png",
        title: "Next.js",
        url: "https://nextjs.org",
    },
    {
        category: "Open Source",
        description: "Next Generation ORM for TypeScript and JavaScript",
        id: 2,
        imageUrl: "https://github.com/prisma.png",

        title: "Prisma",
        url: "https://prisma.io",
    },
    {
        category: "Open Source",
        description: "Utility-fist css framework",
        id: 3,
        imageUrl: "https://github.com/tailwindlabs.png",
        title: "TailwindCSS",
        url: "https://tailwindcss.com",
    },
    {
        category: "Open Source",
        description: "GraphQL implementation ",
        id: 4,
        imageUrl: "https://www.apollographql.com/apollo-home.jpg",
        title: "Apollo GraphQL",
        url: "https://apollographql.com",
    },
];

async function main() {
    await prisma.user.create({
        data: {
            email: `testemail@gmail.com`,
            role: 'ADMIN',
        },
    });

    await prisma.link.createMany({
        data: links,
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
