const Post = {
	author: async (parent, args, { context: { prisma, currentUser } }, info) => {
		// const { users } = ctx.db;
		// return users.find((user) => user.id === parent.author);
		// console.log("......parent", parent);
		const user = await prisma.user.findUnique({
			where: {
				id: parent.authorId,
			},
		});
		// if(currentUser && currentUser.id === parent.authorId) delete user["email"]
		return user;
	},
	comments: async (parent, args, { ctx, context: { prisma } }, info) => {
		const comments = await prisma.comment.findMany({
			where: {
				postId: parent.id,
			},
		});
		return comments;
	},
};

export default Post;
