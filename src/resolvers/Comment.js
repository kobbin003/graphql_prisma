const Comment = {
	author: (parent, args, ctx, info) => {
		const { users } = ctx.db;
		const author = users.find((user) => {
			return user.id === parent.author;
		});
		return author;
	},
	post: (parent, args, ctx, info) => {
		const { posts } = ctx.db;
		return posts.find((post) => post.id === parent.post);
	},
};

export default Comment;
