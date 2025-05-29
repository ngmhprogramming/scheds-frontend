import axios from "axios";

export interface SignupData {
	username: string,
	email: string,
	password: string,
};

export interface LoginData {
	email: string,
	password: string,
};

export const signup = async (data: SignupData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "signup", data,
		{
			headers: { 'Content-Type': 'multipart/form-data' },
			withCredentials: true
		})
		.then(res => {
			return res.data;
		})
		.catch(() => {
			return { error: "API is down!"}
		});
	return res;
};

export const login = async (data: LoginData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "login", data,
		{
			headers: { 'Content-Type': 'multipart/form-data' },
			withCredentials: true
		})
		.then(res => {
			return res.data;
		})
		.catch(() => {
			return { error: "API is down!"}
		});
	return res;
};

export const logout = async () => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "logout", {}, {
			withCredentials: true
		})
		.then(res => {
			return res.data;
		});
	return res;
}