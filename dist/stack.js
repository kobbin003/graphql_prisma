"use strict";

var Mutation = {
  count: function count(parent, args, _ref, info) {
    var pubsub = _ref.pubsub;
    pubsub.publish("count", {
      count: 1
    });
    return 1;
  }
};
var Subscription = {
  count: {
    subscribe: function subscribe(parent, args, _ref2, info) {
      var pubsub = _ref2.pubsub;
      return pubsub.subscribe("count");
    },
    resolve: function resolve(payload) {
      return payload.count * 2;
    }
  }
};