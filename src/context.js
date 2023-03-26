import { PrismaClient } from "@prisma/client";

// 2
const prisma = new PrismaClient();

export function createContext() {
	return { prisma };
}
