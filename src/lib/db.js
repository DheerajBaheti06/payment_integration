import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

prisma.$on("error", (e) => {
  console.error("Prisma Client error:", e);
});

export default prisma;
export { prisma };
