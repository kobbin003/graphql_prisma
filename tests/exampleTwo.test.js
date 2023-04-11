import { getFirstName } from "./getFirstname.js";
beforeAll(() => console.log("before all two"));
test("Should return first name when given full name", () => {
	const firstName = getFirstName("Duyu Kobin");

	expect(firstName).toBe("Duyu");
});
