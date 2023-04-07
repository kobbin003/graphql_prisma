const User = {
	email: (parent, args, { context: { prisma, currentUser } }, info) => {
		// console.log(".........", currentUser, parent);
		if (currentUser && currentUser.id === parent.id) {
			// console.log("YES");
			return parent.email;
		} else {
			// console.log("NO");
			return "x--x--x--x--x";
		}
		//* you can further set to return email when !currentUser
		//* i.e in the case of login or signup!
	},
	posts: async (parent, args, { context: { prisma } }, info) => {
		const posts = await prisma.post.findMany({
			where: {
				authorId: parent.id,
				published: true,
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
