import { server } from "../../src/server.js";

export default async () => {
	const PORT = 7000;
	const HOST = "localhost";
	// console.log("server.....", server);
	global.httpServer = server.listen(7000, "localhost", () =>
		console.log(`server running on http://${HOST}:${PORT}`)
	);
	console.log("in globalSetup");
	global.GLOBALSETUP = "globalSetup";
	global.PORT = PORT;
};
