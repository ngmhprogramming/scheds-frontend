export interface SignupData {
	username: string,
	email: string,
	password: string,
};

export const signup = (data: SignupData) => {
	console.log(data);
};