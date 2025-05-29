import axios from "axios";

export interface SignupData {
	username: string,
	email: string,
	password: string,
};

export const signup = async (data: SignupData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	console.log(backendAddress);	
	console.log(data);
	const res = await axios.post(backendAddress + "signup", data, { headers: { 'Content-Type': 'multipart/form-data' }})
		.then(res => {
			return res.data;
		})
		.catch(error => {
			return { error: "API is down!"}
		});
	return res;
};