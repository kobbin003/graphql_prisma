export const parseJson = (jsonString) => {
	try {
		const parsedValue = JSON.parse(jsonString);
		if (typeof parsedValue !== "string") {
			return parsedValue;
		} else {
			return null;
		}
	} catch (error) {
		//     console.log("Error parsing JSON string:", error.message);
		throw new Error(`${error.message}`);
		return null;
	}
};
