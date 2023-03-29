const Post = {
	author: async (parent, args, { context: { prisma } }, info) => {
		const { users } = ctx.db;
		return users.find((user) => user.id === parent.author);
	},
	comments: (parent, args, ctx, info) => {
		const { comments } = ctx.db;
		return comments.filter((comment) => comment.post === parent.id);
	},
};

export default Post;
