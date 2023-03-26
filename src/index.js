import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// import { schema } from "./schema.graphql";
import { createSchema, createYoga, createPubSub } from "graphql-yoga";
// import { PrismaClient } from "@prisma/client";

// 2
// import { schema } from "./schema";
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutation.js";
import User from "./resolvers/User.js";
import Post from "./resolvers/Post.js";
import Comment from "./resolvers/Comment.js";
import Subscription from "./resolvers/Subscription.js";
import db from "./db.js";
import { createContext } from "./context.js";

const pubsub = createPubSub();
// const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
console.log(".............", __filename);
const __dirname = dirname(__filename);

const schema = createSchema({
	typeDefs: readFileSync(join(__dirname, "schema.graphql"), "utf8"),
	// typeDefs: "/dist/me.graphql",
	resolvers: {
		Query,
		Mutation,
		User,
		Post,
		Comment,
		Subscription,
	},
});
// const prisma = createContext();
// create a yoga instance with the schema
const yoga = createYoga({
	schema,
	graphqlEndpoint: "/",
	landingPage: false, //this will take u directly to GraphiQL
	context: {
		db,
		pubsub,
		context: createContext(),
	},
});

// create server
const server = createServer(yoga);

server.listen(4000, () =>
	console.info(`server is running on http://localhost:4000`)
);

// console.log("babel is working");
