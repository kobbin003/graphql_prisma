export const SIGN_UP = `
	mutation {
		signup(name:"kobin"
		email:"kobin@gm.co"
		password:"passkobin"){
			token
			user{
				name
				email
			}
		}
	}`;

export const DELETE_USER = `
mutation {
    deleteUser{
        name
        email
    }
}
`;
