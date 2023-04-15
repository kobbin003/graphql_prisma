// import { createContext } from "./context";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// import { parseJson } from "./utils/parseJson.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//* just to show how to use config option for .env path other than your root
//* since we are keeping the .env file in th root, we can skip giving this option.
dotenv.config({ path: join(__dirname, "..", ".env") });
export const APP_SECRET = process.env.APP_SECRET;
// console.log("APP_SECRET", APP_SECRET, __filename, __dirname, import.meta);
// const { prisma } = createContext();

export const authenticateUser = async (prisma, request) => {
	const authHeader = request.headers.get("authorization");
	// console.log("auth.js", authHeader);

	if (authHeader) {
		const token = authHeader.split(" ")[1];
		// console.log("auth.......token.........", token);
		// check if token is the current token:
		const tokenPayload = await jwt.verify(token, APP_SECRET);
		// console.log("tokenpayload.........", tokenPayload);
		const userId = tokenPayload.userId;
		// console.log("userId............", userId);
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			// since only user's id will suffice for making queries
			select: {
				id: true,
				currentToken: true,
			},
		});
		delete user["password"];
		// console.log("...............user_auth.js", user);
		// prevent the user from using its old token.
		if (token !== user.currentToken) throw new Error("invalid token");
		return user;
	}
	return null;
};
// {
//   "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNTNkNTViMC0yNmExLTQ1MmItYWU1MS0xMGMzYWZiOTg2MmUiLCJpYXQiOjE2ODAzNTU0MTB9.UovS5wFe9fydMH3iPKxwzFEbRq8r5Z4_PW6BC_oAdsY"
// }
