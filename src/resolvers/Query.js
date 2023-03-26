const Query = {
	// hello: () => "world",
	// name: () => "kobin",
	me: () => ({
		id: 12,
		name: "Duyu Kobin",
		email: "dkfeto@gmail.com",
		age: 30,
	}),
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
			},
		});
		console.log("...............", user_with_argString);
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
	posts: (parent, args, ctx, info) => {
		const { posts } = ctx.db;
		console.log("........", posts);
		if (!args.query) return posts;
		return posts.filter((post) => {
			return (
				post.title.toLowerCase().includes(args.query.toLowerCase()) ||
				post.body.toLowerCase().includes(args.query.toLowerCase())
			);
		});
	},
	comments: (parent, args, ctx, info) => {
		const { comments } = ctx.db;
		console.log("..............", comments);
		if (!args) return comments;
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
