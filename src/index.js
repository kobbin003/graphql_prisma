import { server } from "./server.js";

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
	console.info(
		`server is running on port ${PORT} and database url is ${process.env.DATABASE_URL}`
	)
);

// console.log("babel is working");
