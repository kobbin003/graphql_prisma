// import axios from "axios";
import fetch from "node-fetch";
test("should load all users", async () => {
	// console.log(axios.isCancel("something"));
	const LOAD_USERS = `
	 
		query{
            users {
                id
                name
            }
        }
	 
`;
	const options = {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: LOAD_USERS,
		}),
	};
	const data = await fetch(`http://localhost:7000/`, options);
	// const data = await fetch(`https://graphql-4ygd.onrender.com`, options);
	const users = await data.json();
	console.log(users.data.users);
	expect(1).toBe(1);
});
