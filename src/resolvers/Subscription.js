/**
 * pubsub = publish-subscribe
 *
 * step 1: subscribe(i.e keeps listening on that channel) to a channel: pubsub.subscribe('channel_name')
 *
 * step 2: publish on that channel: pubsub.publish('channel_name',{...published data})
 */

const Subscription = {
	count: {
		subscribe: (parent, args, { pubsub }, info) => {
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
		resolve: (payload) => payload.count * 2,
	},
	comment: {
		subscribe: (parent, { postId }, { pubsub, db }, info) => {
			const post = db.posts.find(
				(post) => post.id === postId && post.published
			);
			if (!post) throw new Error("post not found!");
			// return pubsub.subscribe(`comment post-${postId}`);
			return pubsub.subscribe("comment_channel", postId);
		},
	},
	post: {
		subscribe: (parent, args, { pubsub }, info) => {
			return pubsub.subscribe("anyPost");
		},
	},
	usersPost: {
		subscribe: (parent, { userId }, { pubsub, db }, info) => {
			const { users } = db;
			//check if user exists
			const user = users.find((user) => user.id === userId);
			if (!user) throw new Error("user does not exist!");

			return pubsub.subscribe("users_Post", userId);
			// return pubsub.subscribe("usersPost", userId);
		},
	},
};

export default Subscription;
