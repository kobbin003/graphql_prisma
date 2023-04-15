import { getFirstName } from "./getFirstname.js";
beforeAll(() => console.log("hehe before all", global.PORT));
test("Should return first name when given full name xxx", () => {
	const firstName = getFirstName("Duyu Kobin");

	expect(firstName).toBe("Duyu");
});
