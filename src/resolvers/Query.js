import { deleteFields } from "../utils/deleteFields.js";
const Query = {
	// hello: () => "world",
	// name: () => "kobin",
	// get the currentUser
	me: async (parent, args, { context: { prisma, currentUser }, db }, info) => {
		// console.log("Query...me", currentUser);
		if (currentUser === null) {
			throw new Error("Unauthenticated!");
		}
		const user = await prisma.user.findUnique({
			where: {
				id: currentUser.id,
			},
		});
		deleteFields(user, ["password", "currentToken"]);
		return user;
	},
	//get user by query
	users: async (parent, args, { context, db, request }, info) => {
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
			// select: {
			// 	id: true,
			// 	name: true,
			// 	email: true,
			// },
		});
		// console.log("user with argstring", user_with_argString);
		// return users.filter((user) =>
		// 	user.name.toLowerCase().includes(args.letter.toLowerCase())
		// );
		return user_with_argString;
	},
	// get post by id(it should be the user's post OR a published post)
	post: async (parent, args, { context: { prisma, currentUser } }, info) => {
		const postId = args.id;
		// console.log("currentUser.....post", currentUser);
		const userId = currentUser.id;
		const post = await prisma.post.findFirstOrThrow({
			where: {
				id: postId,
				OR: [
					{
						authorId: userId,
					},
					{
						published: true,
					},
				],
			},
		});
		return post;
	},
	// get all published post by query
	posts: async (parent, args, { context: { prisma } }, info) => {
		const posts = await prisma.post.findMany();
		if (!args.query) return posts;
		const queriedPosts = await prisma.post.findMany({
			where: {
				published: true,
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
	// get current users posts by query
	myPosts: async (parent, args, { context: { prisma, currentUser } }, info) => {
		if (!currentUser) throw new Error("not authorized");
		const userId = currentUser.id;
		const query = args.query;
		const myPosts = await prisma.post.findMany({
			where: {
				authorId: userId,
				OR: [
					{
						title: {
							contains: `${query}`,
						},
					},
					{
						body: {
							contains: `${query}`,
						},
					},
				],
			},
		});
		return myPosts;
	},
	comments: async (parent, args, { context: { prisma } }, info) => {
		const { skip, take, sort } = args;
		// console.log("...................comment", sort?.orderByText);
		const commentsOption = {
			skip,
			take,
			orderBy: {
				text: sort?.orderByText,
			},
		};

		const comments = await prisma.comment.findMany(commentsOption);
		/*
		if (skip || take) {
			comments = await prisma.comment.findMany({
				skip,
				take,
				orderBy: {
					id: text,
				},
			});
		} else {
			comments = await prisma.comment.findMany({
				orderBy: {
					id: "asc",
				},
			});
		}
		*/
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
