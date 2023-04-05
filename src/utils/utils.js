//exclude fields of returned data
export const deleteFields = (object, listOfFields) => {
	listOfFields.forEach((field) => delete object[`${field}`]);
	return;
};

// const user = {
// 	name: "kob",
// 	email: "kob@gm.com",
// 	password: "pass",
// 	token: "koken",
// };
// deleteFields(user, ["password", "token"]);
// console.log("user", user);
