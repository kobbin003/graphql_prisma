"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _uuid = require("uuid");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Mutation = {
  count: function count(parent, args, _ref, info) {
    var pubsub = _ref.pubsub;
    pubsub.publish("count", {
      count: 1
    });
    return 1;
  },
  createUser: function createUser(parent, args, ctx, info) {
    var users = ctx.db.users;
    var _args$data = args.data,
      name = _args$data.name,
      email = _args$data.email,
      age = _args$data.age;
    // const name = args.name;
    // const email = args.email;
    // const age = args.age;
    var emailTaken = users.some(function (user) {
      return user.email === email;
    });
    if (emailTaken) {
      throw new Error("this email has been taken!");
    }
    var user = {
      id: (0, _uuid.v4)(),
      name: name,
      email: email,
      age: age
    };
    users.push(user);
    return user;
  },
  updateUser: function updateUser(parent, args, ctx, info) {
    //! for updating do like updatePost and updateComment(andrew's way)
    //! here,in updateUser(which is my way) we loop many times.
    //! instead loop once to find the user and then mutate its property.
    var id = args.id,
      data = args.data;
    var _ctx$db = ctx.db,
      users = _ctx$db.users,
      posts = _ctx$db.posts,
      comments = _ctx$db.comments;
    var updatedUser;
    // check if user exists
    var userExists = users.some(function (user) {
      return user.id === id;
    });
    if (!userExists) throw new Error("User does not exists!");

    //check if the email is taken provide email has been passed as an update argument.
    if (data.email) {
      var emailTaken = users.some(function (user) {
        return user.email === data.email;
      });
      if (emailTaken) throw new Error("This email is already in use!");
    }
    users = users.map(function (user) {
      if (user.id === id) {
        updatedUser = _objectSpread(_objectSpread({}, user), data);
        return updatedUser;
      } else return user;
    });
    return updatedUser;
  },
  deleteUser: function deleteUser(parent, args, ctx, info) {
    var _ctx$db2 = ctx.db,
      users = _ctx$db2.users,
      posts = _ctx$db2.posts,
      comments = _ctx$db2.comments;
    //delete user
    var userIndex = users.findIndex(function (user) {
      return user.id === args.userId;
    });
    if (userIndex === -1) throw new Error("user not found!");
    var _users$splice = users.splice(userIndex, 1),
      _users$splice2 = _slicedToArray(_users$splice, 1),
      deletedUser = _users$splice2[0];
    // delete post associated with the user.
    posts.filter(function (post) {
      var match = post.author === args.userId;
      if (match) {
        comments.filter(function (comment) {
          return comments.post !== post.id;
        }), _readOnlyError("comments");
      }
      return !match;
    }), _readOnlyError("posts");
    // delete comments associated with the post.
    comments.filter(function (comment) {
      return comment.author !== args.userId;
    }), _readOnlyError("comments");
    return deletedUser;
  },
  createPost: function createPost(parent, args, ctx, info) {
    var _ctx$db3 = ctx.db,
      users = _ctx$db3.users,
      posts = _ctx$db3.posts;
    var _args$data2 = args.data,
      title = _args$data2.title,
      body = _args$data2.body,
      published = _args$data2.published,
      author = _args$data2.author;
    //check if user exists
    var userExists = users.some(function (user) {
      return user.id === author;
    });
    if (!userExists) throw new Error("User does not exists");
    var postWrittenByAuthor = posts.some(function (post) {
      return post.title === title;
    });
    if (postWrittenByAuthor) throw new Error("Post with the same title already exists!");
    var post = {
      id: (0, _uuid.v4)(),
      title: title,
      body: body,
      published: published,
      author: author
    };

    //publish only if published:true
    if (published) {
      //anyPost
      ctx.pubsub.publish("anyPost", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
      //usersPost
      ctx.pubsub.publish("users_Post", author, {
        usersPost: {
          mutation: "CREATED",
          data: post
        }
      });
    }
    // ctx.pubsub.publish("usersPost", author, { post });
    posts.push(post);
    return post;
  },
  updatePost: function updatePost(parent, args, _ref2, info) {
    var db = _ref2.db,
      pubsub = _ref2.pubsub;
    var id = args.id,
      authorId = args.authorId,
      data = args.data;
    var posts = db.posts;

    // check if post exists
    var post = posts.find(function (post) {
      return post.id === id;
    });
    if (!post) throw new Error("Post does not exist!");
    //check if the author is the post's author
    if (!(post.author === authorId)) throw new Error("author not authorised to modify the post");
    if (data.title) post.title = data.title;
    if (data.body) post.body = data.body;
    if (typeof data.published === "boolean") {
      post.published = data.published;
    }

    //publish only if published is set true
    if (post.published) {
      // publish anyPost
      pubsub.publish("anyPost", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });

      //publish usersPost
      pubsub.publish("users_Post", authorId, {
        usersPost: {
          mutation: "UPDATED",
          data: post
        }
      });
    } else {
      throw new Error("this post cannot be published");
    }
    return post;
  },
  deletePost: function deletePost(parent, args, _ref3, info) {
    var db = _ref3.db,
      pubsub = _ref3.pubsub;
    var posts = db.posts;
    var postId = args.postId;
    //check if post exists
    var postIndex = posts.findIndex(function (post) {
      return post.id === postId;
    });
    if (postIndex === -1) throw new Error("post does not exists");

    //delete the post with the postIndex
    var _posts$splice = posts.splice(postIndex, 1),
      _posts$splice2 = _slicedToArray(_posts$splice, 1),
      deletedPost = _posts$splice2[0];
    //publish the post only if deleted post.published is true
    if (deletedPost.published) {
      // publish anyPost
      pubsub.publish("anyPost", {
        post: {
          mutation: "DELETED",
          data: deletedPost
        }
      });
      //allow post delete only if it is the author.
      var authorId = posts[postIndex].author;
      //publish usersPost
      pubsub.publish("users_Post", authorId, {
        usersPost: {
          mutation: "DELETED",
          data: deletedPost
        }
      });
    }
    return deletedPost;
  },
  createComment: function createComment(parent, args, ctx, info) {
    var _ctx$db4 = ctx.db,
      users = _ctx$db4.users,
      posts = _ctx$db4.posts,
      comments = _ctx$db4.comments;
    var _args$data3 = args.data,
      text = _args$data3.text,
      author = _args$data3.author,
      postId = _args$data3.postId;
    var userExists = users.some(function (user) {
      return user.id === author;
    });
    var postExistsAndPublished = posts.some(function (post) {
      return post.id === postId && post.published;
    });
    if (!userExists) throw new Error("User does not exists!");
    if (!postExistsAndPublished) throw new Error("Unable to find Post1");
    var comment = {
      id: (0, _uuid.v4)(),
      text: text,
      author: author,
      post: postId
    };
    comments.push(comment);
    // console.log("....................", { ...comment });
    ctx.pubsub.publish("comment_channel", postId, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });
    return comment;
  },
  updateComment: function updateComment(parent, args, _ref4, info) {
    var db = _ref4.db,
      pubsub = _ref4.pubsub;
    var id = args.id,
      text = args.text;
    var comments = db.comments;
    //check if comment exists
    var comment = comments.find(function (comment) {
      return comment.id === id;
    });
    if (!comment) throw new Error("comment does not exists!");
    comment.text = text;
    //publish
    pubsub.publish("comment_channel", comment.post, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });
    return comment;
  },
  deleteComment: function deleteComment(parent, args, _ref5, info) {
    var db = _ref5.db,
      pubsub = _ref5.pubsub;
    var comments = db.comments;
    //check if comment exists
    var commentIndex = comments.findIndex(function (comment) {
      return comment.id === args.commentId;
    });
    if (commentIndex === -1) throw new Error("comment does not exists");

    //delete the comment with the commentIndex
    var _comments$splice = comments.splice(commentIndex, 1),
      _comments$splice2 = _slicedToArray(_comments$splice, 1),
      deletedComment = _comments$splice2[0];
    //publish
    console.log("..........", deletedComment);
    pubsub.publish("comment_channel", deletedComment.post, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });
    return deletedComment;
  }
};
var _default = Mutation;
exports["default"] = _default;