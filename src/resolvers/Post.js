const Post = {
	author: (parent, args, ctx, info) => {
		const { users } = ctx.db;
		return users.find((user) => user.id === parent.author);
	},
	comments: (parent, args, ctx, info) => {
		const { comments } = ctx.db;
		return comments.filter((comment) => comment.post === parent.id);
	},
};

export default Post;
