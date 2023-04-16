// import axios from "axios";
// import fetch from "node-fetch";
import { LOAD_USERS } from "./queries/query/users.query.js";
import {
	DELETE_USER,
	LOGIN_AFTER_SIGNUP,
	LOGIN_AFTER_UPDATE,
	LOGIN_USER,
	SIGN_UP,
	UPDATE_USER,
} from "./queries/mutation/users.mutation.js";
import { fetchOptions } from "./testUtils/fetchOptions";
import { fetchLocal as fetch } from "./testUtils/fetch.js";
let token;
beforeAll(async () => {
	// create a user
	const options = fetchOptions(SIGN_UP);
	const response = await fetch(options);
	const { data } = await response.json();
	const user = data.signup;
	// set the token
	token = user.token;
	// console.log("signedUpuser....", user);
});
afterAll(async () => {
	//delete the created user
	const options = fetchOptions(DELETE_USER, token);
	const response = await fetch(options);
	const { data } = await response.json();
	// const deletedUser = data.deleteUser;
	// console.log("user..deleted..", deletedUser);
});
test("should load all users", async () => {
	// console.log("beforeAll-value", beforeAll);
	// console.log(axios.isCancel("something"));

	const options = fetchOptions(LOAD_USERS, token);
	const response = await fetch(options);
	// const data = await fetch(`https://graphql-4ygd.onrender.com`, options);
	const { data } = await response.json();
	const users = data.users;
	// console.log(users.data.users);
	// console.log("load ...........users", users);
	// expect(1).toBe(1);
	expect(users[0]).toEqual({
		id: expect.any(String),
		name: expect.any(String),
	});
});

// test.skip() ---> to skip a particular test
test("should login a signed up a user", async () => {
	const options = fetchOptions(LOGIN_AFTER_SIGNUP, token);
	const response = await fetch(options);
	const { data } = await response.json();
	const user = data.loginAfterSignUp;
	// console.log("user", user);
	expect(1).toBe(1);
	//! THIS WILL THROW ERROR. since it returns email:"x--x--x--x"
	//* check out it out in graphiql
	expect(user).toEqual({
		name: "kobintest",
		email: "kobintest@gm.co",
	});
});

// test.only() ---> to run a particular test ONLY.
test("should show error message: email taken", async () => {
	const options = fetchOptions(SIGN_UP);
	const response2 = await fetch(options);
	const { errors } = await response2.json();
	const errorMessage = errors[0].message;
	// console.log("errorMessage", errors, errorMessage);
	expect(errorMessage).toBe("email has been taken");
});

test("should login a user", async () => {
	const options = fetchOptions(LOGIN_USER);
	const response = await fetch(options);
	const { data } = await response.json();
	const user = data.login;
	//update the token
	token = user.token;
	// console.log("login...", user);
	expect(user).toEqual({
		token: expect.any(String),
		user: {
			name: "kobintest",
			email: expect.any(String),
		},
	});
});

test("should update a user password ", async () => {
	// update password
	const updateOptions = fetchOptions(UPDATE_USER, token);
	const updateResponse = await fetch(updateOptions);
	const { errors, data: updateData } = await updateResponse.json();
	// console.log("updateresponse", errors, updateData);
	// console.log("responseOK", updateResponse.ok);
	expect(errors).toBeUndefined();
	expect(updateData).not.toBeNull();
	//login with new password

	const loginOptions = fetchOptions(LOGIN_AFTER_UPDATE);
	const loginResponse = await fetch(loginOptions);
	const { data: loginData } = await loginResponse.json();
	// console.log(loginData);
	const user = loginData.login;
	token = user.token;
	// console.log("token", token, user);
	// expect(1).toBe(1);
	expect(user).toEqual(
		expect.objectContaining({
			token: expect.any(String),
			user: expect.objectContaining({
				name: "updateNametest",
			}),
		})
	);
});
