import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
}

function createPrismaClient() {
    const url = process.env.DATABASE_URL;

    if(!url) {
        throw new Error("Database url is not set");
    }

    const adapter = new PrismaPg({ connectionString: url });

    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if(process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

/*

But why not do this in production?
In production, your application generally runs in a more controlled environment.

The module is usually initialized once per process or worker, so the global caching workaround for development HMR is generally unnecessary.

That's why the code only caches the instance globally outside production.

One clarification: production still reuses the exported module-level prisma instance. It just doesn't additionally store it on globalThis.

*/

/*

Does one Prisma Client mean one database connection?

No!

This is a very important distinction.

One Prisma Client instance can manage a connection pool containing multiple database connections.

For example:
Prisma Client
     |
     v
Connection Pool
     |
     |---- Connection 1
     |---- Connection 2
     |---- Connection 3
     |---- Connection 4
     |
     v
PostgreSQL


The exact pool configuration depends on the driver and its configuration.

Your PrismaPg adapter uses the PostgreSQL driver's connection pooling behavior.

What is PrismaPg?
A PostgreSQL driver adapter that allows Prisma Client to communicate with PostgreSQL through the Node.js pg driver.

*/