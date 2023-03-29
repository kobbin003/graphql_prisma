const Post = {
	author: async (parent, args, { context: { prisma } }, info) => {
		// const { users } = ctx.db;
		// return users.find((user) => user.id === parent.author);
		console.log("......parent", parent);
		const user = await prisma.user.findUnique({
			where: {
				id: parent.authorId,
			},
		});
		return user;
	},
	comments: (parent, args, ctx, info) => {
		const { comments } = ctx.db;
		return comments.filter((comment) => comment.post === parent.id);
	},
};

export default Post;
