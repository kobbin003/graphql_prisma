import { v4 as uuid4 } from "uuid";
import { GraphQLError } from "graphql";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../auth.js";
import { hashPassword } from "../utils/hashPassword.js";
const Mutation = {
	count: (parent, args, { pubsub, request }, info) => {
		pubsub.publish("count", {
			count: 1,
		});
		// console.log("request...", request);
		return 1;
	},
	signup: async (
		parent,
		{ name, email, password },
		{ context: { prisma } },
		info
	) => {
		// console.log("reached...............");
		// check if email taken
		const emailTaken = await prisma.user.findFirst({
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
		// create id
		const id = uuid4();
		// create token
		const token = jwt.sign({ userId: id }, APP_SECRET);
		// create password hash
		const hashedPassword = await hashPassword(password);
		// create user
		const user = await prisma.user.create({
			data: { id, name, email, password: hashedPassword, currentToken: token },
		});
		delete user["password"];

		return { token, user: userWithoutPassword };
	},
	login: async (
		parent,
		{ email, password },
		{ context: { prisma }, ...restParams },
		info
	) => {
		// console.log(".......restParams", restParams.request.headers);
		// const decoded = jwt.verify()
		let user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!user) throw new Error("no user with such email found");
		const passwordVerified = await compare(password, user.password);
		//* send token if password verified true
		if (!passwordVerified) throw new Error("unable to login");
		const token = await jwt.sign({ userId: user.id }, APP_SECRET);

		//update the currentToken
		user = await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				currentToken: token,
			},
		});
		return { token, user };
	},
	createUser: async (parent, args, { context }, info) => {
		const { name, email, age } = args.data;
		const emailTaken = await context.prisma.user.findFirst({
			where: { email },
		});
		if (emailTaken) {
			// throw new Error("this email has been taken!");
			throw new GraphQLError("email has been taken", {
				extensions: {
					http: {
						status: "409",
						"status-message": "conflict",
					},
				},
			});
		}

		const uuidd = uuid4();
		const user = await context.prisma.user.create({
			data: {
				id: uuidd,
				name,
				email,
				age,
			},
		});
		return user;
	},
	updateUser: async (parent, args, { context }, info) => {
		// check i user is authenticated and authorized
		if (!context.currentUser) throw new Error("user not authorised!");
		console.log("Mutation....updateUser", context.currentUser);

		const userId = context.currentUser.id;
		const { data } = args;
		//check if email taken only if email arg is provided
		if (data.email) {
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
		}
		//update password if password provided
		if (typeof data.password === "string") {
			data.password = await hashPassword(data.password);
		}
		let updatedUser;
		try {
			updatedUser = await context.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					password: await hashPassword(data.password),
					...data,
				},
			});
		} catch (error) {
			//throws error if user with "id" is not found
			throw new GraphQLError("user not found", { extensions: { ...error } });
		}
		delete updatedUser["password"];

		return updatedUser;
	},
	deleteUser: async (parent, args, { db, context }, info) => {
		// check i user is authenticated and authorized
		if (!context.currentUser) throw new Error("user not authorised!");
		let deletedUser;
		try {
			deletedUser = await context.prisma.user.delete({
				where: {
					id: context.currentUser.id,
				},
				select: {
					id: true,
					name: true,
					email: true,
				},
			});
			console.log("deleteduser", deletedUser);
		} catch (error) {
			// it throws an error when user.delete action is prevented
			// due to unavailability of "args.userId"
			throw new GraphQLError("user not found", { extensions: { ...error } });
		}

		return deletedUser;
	},
	createPost: async (
		parent,
		{ data },
		{ pubsub, context: { prisma, currentUser } },
		info
	) => {
		// check i user is authenticated and authorized
		if (!currentUser) throw new Error("user not authorised!");
		// const { users, posts } = ctx.db;
		const { title, body, published } = data;
		const userId = currentUser.id;
		//check if user exists
		const userExists = await prisma.user.findUnique({
			where: {
				id: userId,
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
						id: userId,
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
			//myPosts
			pubsub.publish("myPost_channel", author, {
				myPosts: { mutation: "CREATED", data: createdPost },
			});
		}
		// ctx.pubsub.publish("myPosts", author, { post });
		return createdPost;
	},
	updatePost: async (
		parent,
		args,
		{ db, pubsub, context: { prisma, currentUser } },
		info
	) => {
		// check i user is authenticated and authorized
		if (!currentUser) throw new Error("user not Authorised!");
		const { id, data } = args;
		const authorId = currentUser.id;
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
		// console.log("postExists", postExists);
		if (!postExists) throw new Error("cannot post!");

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
		// updated data has published === false(i.e post is unpublished),
		// delete all the comment associated with the post.
		if (data.published && data.published === false)
			await prisma.comment.deleteMany({
				where: {
					postId: id,
				},
			});

		// console.log(".....................", updatedPost);
		//publish only if published is set true
		const publishedUpdated = typeof updatedPost.published === Boolean;
		const canPublish = updatedPost.published;
		// console.log(".......", canPublish);
		if (publishedUpdated) {
			if (canPublish) {
				// publish anyPost
				pubsub.publish("anyPost", {
					post: { mutation: "UPDATED", data: updatedPost },
				});

				//publish myPosts
				pubsub.publish("myPost_channel", authorId, {
					myPosts: { mutation: "UPDATED", data: updatedPost },
				});
			} else {
				throw new Error("this post cannot be published");
			}
		}

		return updatedPost;
	},
	deletePost: async (
		parent,
		args,
		{ context: { prisma, currentUser }, pubsub },
		info
	) => {
		// check i user is authenticated and authorized
		if (!currentUser) throw new Error("user not suthorised!");
		// const { posts } = db;
		const { postId } = args;
		//check if currentUser is the post's author;
		const userId = currentUser.id;
		const authorOfPost = await prisma.post.findFirst({
			where: {
				// author: {
				// 	id: userId,
				// },
				//   OR
				authorId: userId,
			},
		});
		if (!authorOfPost) throw new Error("unauthorised user");
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
			// console.log("...........authorId", authorId);
			//publish myPosts
			pubsub.publish("myPost_channel", authorId, {
				myPosts: {
					mutation: "DELETED",
					data: deletedPost,
				},
			});
		}
		return deletedPost;
	},
	createComment: async (
		parent,
		args,
		{ context: { prisma, currentUser }, pubsub },
		info
	) => {
		// check i user is authenticated and authorized
		if (!currentUser) throw new Error("user not suthorised!");
		const { text, postId } = args.data;
		// const postExistsAndPublished = posts.some((post) => {
		// 	return post.id === postId && post.published;
		// });
		const postExistsAndPublished = await prisma.post.findFirst({
			where: {
				AND: [
					{
						id: postId,
					},
					{
						published: true,
					},
				],
			},
		});
		if (!postExistsAndPublished) throw new Error("Unable to find Post");

		const newComment = await prisma.comment.create({
			data: {
				id: uuid4(),
				text,
				author: {
					connect: {
						id: currentUser.id,
					},
				},
				post: {
					connect: {
						id: postId,
					},
				},
			},
			include: {
				post: true,
				author: true,
			},
		});
		// console.log("................", newComment);
		// const comment = { id: uuid4(), text, author, post: postId };
		// comments.push(comment);
		// console.log("....................", { ...comment });
		pubsub.publish("comment_channel", postId, {
			comment: { mutation: "CREATED", data: newComment },
		});
		return newComment;
	},
	updateComment: async (
		parent,
		args,
		{ context: { prisma, currentUser }, pubsub },
		info
	) => {
		// check i user is authenticated and authorized
		if (!currentUser) throw new Error("user not authorised!");
		const { id, text } = args;
		// other users cannot update comment
		const commentExists = await prisma.comment.findFirst({
			where: {
				id,
				authorId: currentUser.id,
			},
		});
		if (!commentExists) throw new Error("comment does not exist");
		// update comment
		let updatedComment;
		try {
			updatedComment = await prisma.comment.update({
				where: { id },
				data: { text },
			});
			// console.log("1updatedcomment........", updatedComment);
		} catch (error) {
			throw new Error(" comment does not exist");
			throw new GraphQLError("comment does not exists!");
		}
		// console.log("2updatedcomment........", updatedComment);
		//publish
		pubsub.publish("comment_channel", updatedComment.postId, {
			comment: { mutation: "UPDATED", data: updatedComment },
		});

		return updatedComment;
	},
	deleteComment: async (
		parent,
		args,
		{ context: { prisma, currentUser }, pubsub },
		info
	) => {
		// check i user is authenticated and authorized
		if (!currentUser) throw new Error("user not suthorised!");
		const { commentId } = args;
		// other users cannot delete comment
		const commentExists = await prisma.comment.findFirst({
			where: {
				id: commentId,
				authorId: currentUser.id,
			},
		});
		if (!commentExists) throw new Error("comment does not exist");
		// delete comment
		let deletedComment;
		try {
			deletedComment = await prisma.comment.delete({
				where: {
					id: commentId,
				},
			});
		} catch (error) {
			throw new GraphQLError("comment does not exist");
		}
		// console.log("..........", deletedComment);
		pubsub.publish("comment_channel", deletedComment.post, {
			comment: { mutation: "DELETED", data: deletedComment },
		});
		return deletedComment;
	},
};

export default Mutation;
