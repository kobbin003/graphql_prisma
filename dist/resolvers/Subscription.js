"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * pubsub = publish-subscribe
 *
 * step 1: subscribe(i.e keeps listening on that channel) to a channel: pubsub.subscribe('channel_name')
 *
 * step 2: publish on that channel: pubsub.publish('channel_name',{...published data})
 */

var Subscription = {
  count: {
    subscribe: function subscribe(parent, args, _ref, info) {
      var pubsub = _ref.pubsub;
      // let num = 0;
      // const countInterval = setInterval(() => {
      // 	num++;
      // 	pubsub.publish("count", {
      // 		count: num, // this second arg of publish is what should match with the schema
      // 	});
      // 	// pubsub.publish("count", num);
      // 	if (num > 10) {
      // 		clearInterval(countInterval);
      // 	}
      // }, 1000);

      return pubsub.subscribe("count");
      // return pubsub.asyncIterator("count");
    },

    resolve: function resolve(payload) {
      return payload.count * 2;
    }
  },
  comment: {
    subscribe: function subscribe(parent, _ref2, _ref3, info) {
      var postId = _ref2.postId;
      var pubsub = _ref3.pubsub,
        db = _ref3.db;
      var post = db.posts.find(function (post) {
        return post.id === postId && post.published;
      });
      if (!post) throw new Error("post not found!");
      // return pubsub.subscribe(`comment post-${postId}`);
      return pubsub.subscribe("comment_channel", postId);
    }
  },
  post: {
    subscribe: function subscribe(parent, args, _ref4, info) {
      var pubsub = _ref4.pubsub;
      return pubsub.subscribe("anyPost");
    }
  },
  usersPost: {
    subscribe: function subscribe(parent, _ref5, _ref6, info) {
      var userId = _ref5.userId;
      var pubsub = _ref6.pubsub,
        db = _ref6.db;
      var users = db.users;
      //check if user exists
      var user = users.find(function (user) {
        return user.id === userId;
      });
      if (!user) throw new Error("user does not exist!");
      return pubsub.subscribe("users_Post", userId);
      // return pubsub.subscribe("usersPost", userId);
    }
  }
};
var _default = Subscription;
exports["default"] = _default;