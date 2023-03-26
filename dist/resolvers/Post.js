"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Post = {
  author: function author(parent, args, ctx, info) {
    var users = ctx.db.users;
    return users.find(function (user) {
      return user.id === parent.author;
    });
  },
  comments: function comments(parent, args, ctx, info) {
    var comments = ctx.db.comments;
    return comments.filter(function (comment) {
      return comment.post === parent.id;
    });
  }
};
var _default = Post;
exports["default"] = _default;