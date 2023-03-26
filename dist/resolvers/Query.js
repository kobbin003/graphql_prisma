"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Query = {
  // hello: () => "world",
  // name: () => "kobin",
  me: function me() {
    return {
      id: 12,
      name: "Duyu Kobin",
      email: "dkfeto@gmail.com",
      age: 30
    };
  },
  users: function users(parent, args, ctx, info) {
    console.log(".................users!!!!!!!");
    var users = ctx.db.users;
    if (!args.letter) return users;
    return users.filter(function (user) {
      return user.name.toLowerCase().includes(args.letter.toLowerCase());
    });
  },
  post: function post() {
    return {
      id: 21,
      title: "my first graphql api",
      published: false
    };
  },
  posts: function posts(parent, args, ctx, info) {
    var posts = ctx.db.posts;
    console.log("........", posts);
    if (!args.query) return posts;
    return posts.filter(function (post) {
      return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  comments: function comments(parent, args, ctx, info) {
    var comments = ctx.db.comments;
    console.log("..............", comments);
    if (!args) return comments;
  },
  takeArgument: function takeArgument(parent, args, ctx, info) {
    if (args.msg) return "This is the message: ".concat(args.msg);else return "No message found!";
  },
  addFloats: function addFloats(parent, args, ctx, info) {
    if (args.nums.length == 0) return 0;
    return args.nums.reduce(function (acc, val) {
      return acc + val;
    });
  }
};
exports["default"] = Query;