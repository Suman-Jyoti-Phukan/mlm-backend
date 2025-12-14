import { PrismaClient } from "../generated/prisma/client";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import mariadb from "mariadb";

import { env } from "../config/env.config";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createConnectionPool = () => {
  const url = new URL(env.DATABASE_URL.replace(/^mysql:\/\//, "http://"));

  return mariadb.createPool({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  } as mariadb.PoolConfig);
};

const pool = createConnectionPool();

const adapter = new PrismaMariaDb(pool as any);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  } as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

// Suman -> We can initilize the pool with the below code too.
/**
 * import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
});
const prisma = new PrismaClient({ adapter });

export { prisma }
 */
