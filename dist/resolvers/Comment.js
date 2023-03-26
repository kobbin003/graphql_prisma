"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Comment = {
  author: function author(parent, args, ctx, info) {
    var users = ctx.db.users;
    var author = users.find(function (user) {
      return user.id === parent.author;
    });
    return author;
  },
  post: function post(parent, args, ctx, info) {
    var posts = ctx.db.posts;
    return posts.find(function (post) {
      return post.id === parent.post;
    });
  }
};
var _default = Comment;
exports["default"] = _default;