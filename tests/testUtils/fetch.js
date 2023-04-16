import fetch from "node-fetch";
export const fetchLocal = async (options) => {
	const response = await fetch(`http://localhost:7000/`, options);
	return response;
};
