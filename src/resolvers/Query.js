const Query = {
	// hello: () => "world",
	// name: () => "kobin",
	me: (parent, args, { context, db }, info) => {
		// console.log("Query...me", context.currentUser);
		if (context.currentUser === null) {
			throw new Error("Unauthenticated!");
		}

		return context.currentUser;
	},
	users: async (parent, args, { context, db }, info) => {
		const users = await context.prisma.user.findMany();
		// console.log(".................users!!!!!!!", users);
		// const users = db.users;

		if (!args.letter) return users;
		const user_with_argString = await context.prisma.user.findMany({
			where: {
				name: {
					contains: `${args.letter}`,
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		});
		// console.log("user with argstring", user_with_argString);
		// return users.filter((user) =>
		// 	user.name.toLowerCase().includes(args.letter.toLowerCase())
		// );
		return user_with_argString;
	},
	post: () => ({
		id: 21,
		title: "my first graphql api",
		published: false,
	}),
	posts: async (parent, args, { context: { prisma } }, info) => {
		const posts = await prisma.post.findMany();
		if (!args.query) return posts;
		const queriedPosts = await prisma.post.findMany({
			where: {
				OR: [
					{
						title: {
							contains: `${args.query}`,
						},
					},
					{
						body: {
							contains: `${args.query}`,
						},
					},
				],
			},
		});
		return queriedPosts;
	},
	comments: async (parent, args, { context: { prisma } }, info) => {
		const { skip, take } = args;
		let comments;
		if (skip || take) {
			comments = await prisma.comment.findMany({
				skip,
				take,
				orderBy: {
					id: "asc",
				},
			});
		} else {
			comments = await prisma.comment.findMany({
				orderBy: {
					id: "asc",
				},
			});
		}
		// console.log("..............", comments);
		return comments;
	},
	takeArgument: (parent, args, ctx, info) => {
		if (args.msg) return `This is the message: ${args.msg}`;
		else return "No message found!";
	},
	addFloats: (parent, args, ctx, info) => {
		if (args.nums.length == 0) return 0;
		return args.nums.reduce((acc, val) => acc + val);
	},
};

export { Query as default };
