import { Headers } from "node-fetch";
export const fetchOptions = (query, token) => {
	const headerFields = {
		"Content-Type": "application/json",
		// Authorization: token && `Bearer ${token}`,
	};
	const headers = new Headers({ ...headerFields });
	if (typeof token === "string") {
		// console.log("token present.........fetchOptions", token);
		headers.append("Authorization", `Bearer ${token}`);
		// console.log("headers.........fetchOptions", headers);
	}
	const options = {
		method: "post",
		headers,
		body: JSON.stringify({
			query: `${query}`,
		}),
	};

	// console.log("headers.....out....fetchOptions", options);
	return options;
};
