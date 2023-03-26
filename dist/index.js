"use strict";

var _nodeHttp = require("node:http");
var _nodeFs = require("node:fs");
var _nodePath = require("node:path");
var _nodeUrl = require("node:url");
var _graphqlYoga = require("graphql-yoga");
var _Query = _interopRequireDefault(require("./resolvers/Query.js"));
var _Mutation = _interopRequireDefault(require("./resolvers/Mutation.js"));
var _User = _interopRequireDefault(require("./resolvers/User.js"));
var _Post = _interopRequireDefault(require("./resolvers/Post.js"));
var _Comment = _interopRequireDefault(require("./resolvers/Comment.js"));
var _Subscription = _interopRequireDefault(require("./resolvers/Subscription.js"));
var _db = _interopRequireDefault(require("./db.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// import { schema } from "./schema.graphql";

// import { schema } from "./schema";

var pubsub = (0, _graphqlYoga.createPubSub)();
var _filename = (0, _nodeUrl.fileURLToPath)(import.meta.url);
console.log(".............", _filename);
var _dirname = (0, _nodePath.dirname)(_filename);
var schema = (0, _graphqlYoga.createSchema)({
  typeDefs: (0, _nodeFs.readFileSync)((0, _nodePath.join)(_dirname, "schema.graphql"), "utf8"),
  // typeDefs: "/dist/me.graphql",
  resolvers: {
    Query: _Query["default"],
    Mutation: _Mutation["default"],
    User: _User["default"],
    Post: _Post["default"],
    Comment: _Comment["default"],
    Subscription: _Subscription["default"]
  }
});
// create a yoga instance with the schema
var yoga = (0, _graphqlYoga.createYoga)({
  schema: schema,
  graphqlEndpoint: "/",
  landingPage: false,
  //this will take u directly to GraphiQL
  context: {
    db: _db["default"],
    pubsub: pubsub
  }
});

// create server
var server = (0, _nodeHttp.createServer)(yoga);
server.listen(4000, function () {
  return console.info("server is running on http://localhost:4000");
});

// console.log("babel is working");