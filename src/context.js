import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "./auth.js";
// 2
const prisma = new PrismaClient();
export async function createContext(req) {
	return {
		prisma,
		currentUser: await authenticateUser(prisma, req),
	};
}
// console.log("context created");
