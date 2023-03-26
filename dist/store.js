"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = void 0;
var _graphqlYoga = require("graphql-yoga");
var _db = _interopRequireDefault(require("./db"));
var _Query = _interopRequireDefault(require("./resolvers/Query"));
var _Mutation = _interopRequireDefault(require("./resolvers/Mutation.js"));
var _User = _interopRequireDefault(require("./resolvers/User.js"));
var _Post = _interopRequireDefault(require("./resolvers/Post.js"));
var _Comment = _interopRequireDefault(require("./resolvers/Comment.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var schema = (0, _graphqlYoga.createSchema)({
  typeDefs: "./schema.graphql",
  resolvers: {
    Query: _Query["default"],
    Mutation: _Mutation["default"],
    User: _User["default"],
    Post: _Post["default"],
    Comment: _Comment["default"]
  },
  context: {
    db: _db["default"]
  }
});
exports.schema = schema;