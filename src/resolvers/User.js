const User = {
	posts: async (parent, args, { context: { prisma } }, info) => {
		const posts = await prisma.post.findMany({
			where: {
				authorId: parent.id,
			},
		});
		return posts;
	},
	comments: async (parent, args, { context: { prisma } }, info) => {
		// const { comments } = ctx.db;
		// return comments.filter((comment) => comment.author === parent.id);
		const comments = await prisma.comment.findMany({
			where: {
				authorId: parent.id,
			},
		});
	},
};
export default User;
