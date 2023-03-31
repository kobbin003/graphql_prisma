const Comment = {
	author: async (parent, args, ctx, info) => {
		const { users } = ctx.db;
		return users.filter((user) => userInfo.id === parent.author);
	},
	post: async (parent, args, ctx, info) => {
		const { posts } = ctx.db;
		return posts.filter((post) => post.id === parent.author);
	},
};

export default Comment;
