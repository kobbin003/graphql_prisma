"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var User = {
  posts: function posts(parent, args, ctx, info) {
    var posts = ctx.db.posts;
    return posts.filter(function (post) {
      return post.author === parent.id;
    }
    // return parent.posts.some((postId) => postId === post.id);
    );
  },

  comments: function comments(parent, args, ctx, info) {
    var comments = ctx.db.comments;
    return comments.filter(function (comment) {
      return comment.author === parent.id;
    });
  }
};
var _default = User;
exports["default"] = _default;