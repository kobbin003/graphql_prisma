const Query = {
	// hello: () => "world",
	// name: () => "kobin",
	me: () => ({
		id: 12,
		name: "Duyu Kobin",
		email: "dkfeto@gmail.com",
		age: 30,
	}),
	users: async (parent, args, { db }, info) => {
		const users = db.users;

		if (!args.letter) return users;
		return users.filter((user) =>
			user.name.toLowerCase().includes(args.letter.toLowerCase())
		);
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
