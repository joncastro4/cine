import { PrismaClient } from '@prisma/client';

// En dev el servidor se reinicia solo y sin esto se abren muchas conexiones.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
