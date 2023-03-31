const Comment = {
	author: async (parent, args, { context: { prisma } }, info) => {
		const author = await prisma.user.findUnique({
			where: {
				id: parent.authorId,
			},
		});
		return author;
	},
	post: async (parent, args, { context: { prisma } }, info) => {
		const post = await prisma.post.findUnique({
			where: {
				id: parent.postId,
			},
		});
		console.log("......post", post);
		return post;
	},
};

export default Comment;
