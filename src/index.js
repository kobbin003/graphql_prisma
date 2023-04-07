import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { createSchema, createYoga, createPubSub } from "graphql-yoga";
import { resolvers } from "./resolvers/index.js";
import db from "./db.js";
import { createContext } from "./context.js";

const pubsub = createPubSub();
// const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = createSchema({
	typeDefs: readFileSync(join(__dirname, "schema.graphql"), "utf8"),
	// typeDefs: "/dist/me.graphql",
	resolvers,
});
// const prisma = createContext();
let yogaOptions = {
	schema,
	graphqlEndpoint: "/",
	landingPage: false, //this will take u directly to GraphiQL
	context: async ({ request }) => ({
		db,
		pubsub,
		context: await createContext(request),
	}),
};
/*
if (process.env.NODE_ENV === "development") {
	// console.log("development environment");
	// disable masked error if in development environment
	yogaOptions = { ...yogaOptions, maskedErrors: false };
}
*/
// create a yoga instance with the schema
const yoga = createYoga(yogaOptions);
// console.log("yoga...........", yoga);
// create server
const server = createServer(yoga);

const PORT = process.env.PORT || 4000;
server.listen(4000, () => console.info(`server is running on port ${PORT}`));

// console.log("babel is working");
