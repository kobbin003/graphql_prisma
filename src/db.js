let users = [
	{
		id: "1",
		name: "kobu",
		email: "dk@gmail.com",
		age: 30,
	},
	{
		id: "2",
		name: "takha",
		email: "tk@gmail.com",
		age: 31,
	},
	{
		id: "3",
		name: "duyu",
		email: "du@gmail.com",
		age: 32,
	},
];

// mock posts data
let posts = [
	{
		id: "11",
		title: "first post",
		body: "this is first authors first post",
		published: true,
		author: "1",
	},
	{
		id: "12",
		title: "second post",
		body: "this is first authors second post",
		published: true,
		author: "1",
	},
	{
		id: "13",
		title: "third post",
		body: "this is second authors first post",
		published: false,
		author: "2",
	},
];

// mock comments data
let comments = [
	{
		id: "101",
		text: "comment no. 1",
		author: "1",
		post: "11",
	},
	{
		id: "102",
		text: "comment no. 2",
		author: "2",
		post: "11",
	},
	{
		id: "103",
		text: "comment no. 3",
		author: "2",
		post: "12",
	},
	{
		id: "104",
		text: "comment no. 4",
		author: "3",
		post: "13",
	},
];

const db = { users, posts, comments };

export default db;
