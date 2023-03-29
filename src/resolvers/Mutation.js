import { v4 as uuid4 } from "uuid";
import { GraphQLError } from "graphql";
const Mutation = {
	count: (parent, args, { pubsub }, info) => {
		pubsub.publish("count", {
			count: 1,
		});
		return 1;
	},
	createUser: async (parent, args, { db, context }, info) => {
		const { name, email, age } = args.data;
		const emailTaken = await context.prisma.user.findFirst({
			where: { email },
		});
		if (emailTaken) {
			// throw new Error("this email has been taken!");
			throw new GraphQLError("email has been taken", {
				extensions: {
					status: "409",
					"status-message": "conflict",
				},
			});
		}

		const user = await context.prisma.user.create({
			data: {
				id: uuid4(),
				name,
				email,
				age,
			},
		});
		return user;
	},
	updateUser: async (parent, args, { context }, info) => {
		const { id, data } = args;
		//check if email taken
		const emailTaken = await context.prisma.user.findFirst({
			where: { email: data.email },
		});
		if (emailTaken) {
			// throw new Error("this email has been taken!");
			throw new GraphQLError("email has been taken", {
				extensions: {
					status: "409",
					"status-message": "conflict",
				},
			});
		}
		let updatedUser;
		try {
			updatedUser = await context.prisma.user.update({
				where: {
					id,
				},
				data,
			});
		} catch (error) {
			//throws error if user with "id" is not found
			throw new GraphQLError("user not found", { extensions: { ...error } });
		}

		return updatedUser;
	},
	deleteUser: async (parent, args, { db, context }, info) => {
		let deletedUser;
		try {
			deletedUser = await context.prisma.user.delete({
				where: {
					id: args.userId,
				},
				select: {
					id: true,
					name: true,
					email: true,
				},
			});
		} catch (error) {
			// it throws an error when user.delete action is prevented
			// due to unavailability of "args.userId"
			throw new GraphQLError("user not found", { extensions: { ...error } });
		}
		// delete post associated with the user.
		// delete comments associated with the post.
		return deletedUser;
	},
	createPost: async (
		parent,
		{ data },
		{ pubsub, context: { prisma } },
		info
	) => {
		// const { users, posts } = ctx.db;
		const { title, body, published, author } = data;
		//check if user exists
		const userExists = await prisma.user.findUnique({
			where: {
				id: data.author,
			},
		});

		if (!userExists) throw new GraphQLError("User does not exists");
		const createdPost = await prisma.post.create({
			data: {
				id: uuid4(),
				title,
				body,
				published,
				author: {
					connect: {
						id: author,
					},
				},
			},
		});
		// const post = { id: uuid4(), title, body, published, author };

		//publish only if published:true
		if (published) {
			//anyPost
			pubsub.publish("anyPost", {
				post: { mutation: "CREATED", data: createdPost },
			});
			//usersPost
			pubsub.publish("users_Post", author, {
				usersPost: { mutation: "CREATED", data: createdPost },
			});
		}
		// ctx.pubsub.publish("usersPost", author, { post });
		return createdPost;
	},
	updatePost: async (
		parent,
		args,
		{ db, pubsub, context: { prisma } },
		info
	) => {
		const { id, authorId, data } = args;
		// const { posts } = db;

		// check if post exists && the user provided is the post's author
		//* since AND operation does not work on findUnique
		//* use findMany instead of findFirst;
		const postExists = await prisma.post.findFirst({
			where: {
				AND: [
					{
						id,
					},
					{
						author: {
							id: authorId,
						},
					},
				],
			},
		});
		console.log("postExists", postExists);
		if (!postExists) throw new Error("cannot post!");

		// the user provided is the post's author
		// const authorOfpostExists = postExists.authorId;
		// console.log(".............", authorOfpostExists);
		// if (authorOfpostExists != authorId)
		// 	throw new Error("unauthorise to update the post");

		const updatedPost = await prisma.post.update({
			where: {
				id,
			},
			data: {
				...data,
			},
			// include: {
			// 	author: true,
			// },
		});

		console.log(".....................", updatedPost);
		//publish only if published is set true
		const publishedUpdated = typeof updatedPost.published === Boolean;
		const canPublish = updatedPost.published;
		console.log(".......", canPublish);
		if (publishedUpdated) {
			if (canPublish) {
				// publish anyPost
				pubsub.publish("anyPost", {
					post: { mutation: "UPDATED", data: updatedPost },
				});

				//publish usersPost
				pubsub.publish("users_Post", authorId, {
					usersPost: { mutation: "UPDATED", data: updatedPost },
				});
			} else {
				throw new Error("this post cannot be published");
			}
		}

		return updatedPost;
	},
	deletePost: async (parent, args, { context: { prisma }, pubsub }, info) => {
		// const { posts } = db;
		const { postId } = args;
		//check if post exists
		let deletedPost;
		try {
			deletedPost = await prisma.post.delete({
				where: { id: postId },
			});
		} catch (error) {
			throw new GraphQLError("post does not exists", {
				extensions: { ...error },
			});
		}

		//delete the post with the postIndex
		// const [deletedPost] = posts.splice(postIndex, 1);
		//publish the post only if deleted post.published is true
		if (deletedPost.published) {
			// publish anyPost
			pubsub.publish("anyPost", {
				post: { mutation: "DELETED", data: deletedPost },
			});
			const authorId = deletedPost.authorId;
			console.log("...........authorId", authorId);
			//publish usersPost
			pubsub.publish("users_Post", authorId, {
				usersPost: {
					mutation: "DELETED",
					data: deletedPost,
				},
			});
		}
		return deletedPost;
	},
	createComment: (parent, args, ctx, info) => {
		const { users, posts, comments } = ctx.db;
		const { text, author, postId } = args.data;
		const userExists = users.some((user) => user.id === author);
		const postExistsAndPublished = posts.some((post) => {
			return post.id === postId && post.published;
		});
		if (!userExists) throw new Error("User does not exists!");
		if (!postExistsAndPublished) throw new Error("Unable to find Post1");
		const comment = { id: uuid4(), text, author, post: postId };
		comments.push(comment);
		// console.log("....................", { ...comment });
		ctx.pubsub.publish("comment_channel", postId, {
			comment: { mutation: "CREATED", data: comment },
		});
		return comment;
	},
	updateComment: (parent, args, { db, pubsub }, info) => {
		const { id, text } = args;
		const { comments } = db;
		//check if comment exists
		const comment = comments.find((comment) => comment.id === id);
		if (!comment) throw new Error("comment does not exists!");

		comment.text = text;
		//publish
		pubsub.publish("comment_channel", comment.post, {
			comment: { mutation: "UPDATED", data: comment },
		});

		return comment;
	},
	deleteComment: (parent, args, { db, pubsub }, info) => {
		const { comments } = db;
		//check if comment exists
		const commentIndex = comments.findIndex(
			(comment) => comment.id === args.commentId
		);
		if (commentIndex === -1) throw new Error("comment does not exists");

		//delete the comment with the commentIndex
		const [deletedComment] = comments.splice(commentIndex, 1);
		//publish
		console.log("..........", deletedComment);
		pubsub.publish("comment_channel", deletedComment.post, {
			comment: { mutation: "DELETED", data: deletedComment },
		});
		return deletedComment;
	},
};

export default Mutation;
