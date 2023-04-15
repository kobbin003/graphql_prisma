import { getFirstName } from "./getFirstname.js";
beforeAll(() => console.log("before all two"));
test.only("Should return first name when given full name xxx", () => {
	const firstName = getFirstName("Duyu Kobin");

	expect(firstName).toBe("Duyu");
});

// test("abc", () => expect(1).toBe(1));
