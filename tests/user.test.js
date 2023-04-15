// import axios from "axios";
import fetch from "node-fetch";
import { LOAD_USERS } from "./queries/query/users.query.js";
import { DELETE_USER, SIGN_UP } from "./queries/mutation/users.mutation.js";
import { fetchOptions } from "./testUtils/fetchOptions";
let token, user;
beforeAll(async () => {
	// create a user
	const options = fetchOptions(SIGN_UP);
	const response = await fetch(`http://localhost:7000/`, options);
	const result = await response.json();
	const data = result.data.signup;
	// set the token
	token = data.token;
	//set the user
	user = data.user;
	console.log("user....", token, user);
});
afterAll(async () => {
	//delete the created user
	const options = fetchOptions(DELETE_USER, token);
	const response = await fetch(`http://localhost:7000/`, options);
	const result = await response.json();
	const data = result.data;
	console.log("user..deleted..", data);
});
test("should load all users", async () => {
	// console.log("beforeAll-value", beforeAll);
	// console.log(axios.isCancel("something"));

	const options = fetchOptions(LOAD_USERS, token);
	const data = await fetch(`http://localhost:7000/`, options);
	// const data = await fetch(`https://graphql-4ygd.onrender.com`, options);
	const users = await data.json();
	// console.log(users.data.users);
	console.log("load ...........users", users);
	// expect(1).toBe(1);
	expect(users.data.users[0]).toEqual({
		id: expect.any(String),
		name: expect.any(String),
	});
});

// test.skip() ---> to skip a particular test
test("should sign up a user", async () => {
	expect(user).toEqual(
		expect.objectContaining({
			name: "kobin",
			email: expect.any(String),
		})
	);
	//! THIS WILL THROW ERROR. since it returns email:"x--x--x--x"
	//* check out it out in graphiql
	expect(user).toEqual({
		name: "kobin",
		email: "kobin@gm.co",
	});
});

// test.only() ---> to run a particular test ONLY.
test("should show error message: email taken", async () => {
	const options = fetchOptions(SIGN_UP);
	// const response1 = await fetch(`http://localhost:7000/`, options);
	const response2 = await fetch(`http://localhost:7000/`, options);
	const data = await response2.json();
	const errorMessage = data.errors[0].message;
	console.log(errorMessage);
	expect(errorMessage).toBe("email has been taken");
});
