// import { createContext } from "./context";
import jwt from "jsonwebtoken";

export const APP_SECRET = "this is my secret";

// const { prisma } = createContext();
export const authenticateUser = async (prisma, request) => {
	const header = request.headers.get("authorization");
	// console.log("auth.js", header);

	if (header !== null) {
		const token = header;
		// console.log("token.........", token);
		const tokenPayload = await jwt.verify(token, APP_SECRET);
		// console.log("tokenpayload.........", tokenPayload);
		const userId = tokenPayload.userId;
		// console.log("userId............", userId);
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		return user;
	}
	return null;
};
// {
//   "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNTNkNTViMC0yNmExLTQ1MmItYWU1MS0xMGMzYWZiOTg2MmUiLCJpYXQiOjE2ODAzNTU0MTB9.UovS5wFe9fydMH3iPKxwzFEbRq8r5Z4_PW6BC_oAdsY"
// }
