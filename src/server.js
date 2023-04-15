import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { createSchema, createYoga, createPubSub } from "graphql-yoga";
import { resolvers } from "./resolvers/index.js";
import db from "./db.js";
import { createContext } from "./context.js";
import * as dotenv from "dotenv";

const pubsub = createPubSub();
// const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
/**
 * In browsers, this(url) is either the URL from which the script was obtained (for external scripts), or the URL of the containing document (for inline scripts). In Node.js, this is the file path (including the file:// protocol).
 */
const __dirname = dirname(__filename);

// set env file path to .env.development
dotenv.config({ path: join(__dirname, `.env.${process.env.NODE_ENV}`) });
console.log("process.env............&*%^$&^%$*", process.env.NAME);
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
		// db,
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
export const server = createServer(yoga);

// console.log("server........>!!!!!!!", server);
