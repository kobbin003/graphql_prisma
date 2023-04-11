import { server } from "../../src/server.js";

export default async () => {
	global.httpServer.close();
	console.log("in globalTeardown");
	console.log(global.GLOBALSETUP);
};
