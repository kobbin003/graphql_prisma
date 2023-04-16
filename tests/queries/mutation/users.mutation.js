export const SIGN_UP = `
	mutation {
		signup(name:"kobintest",
		email:"kobintest@gm.co",
		password:"passkobintest"){
			token
	user{
				name
				email
			}
		}
	}`;

export const LOGIN_USER = `
	mutation {
		login(
			email:"kobintest@gm.co",
			password:"passkobintest")
			{
				token
				user{
					name
					email
				}
			}
	}`;

export const UPDATE_USER = `
mutation {
	updateUser(data:{
		password:"updatepasstest",
		name:"updateNametest"
	}){
		name
	}
}`;
export const LOGIN_AFTER_UPDATE = `
mutation {
	login(
		email:"kobintest@gm.co",
		password:"updatepasstest")
		{
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

export const LOGIN_AFTER_SIGNUP = `
mutation {
	loginAfterSignUp{
		name
		email
	}
}`;
