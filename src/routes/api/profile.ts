import axios from "axios";

export interface newProfileData {
	username: string,
	full_name: string,
	pfp_url: string,
	bio: string,
};

export interface newLoginData {
	email: string,
	password: string,
}

export const profileUpdate = async (data: newProfileData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "profile/update/profile", data,
		{
			headers: { 'Content-Type': 'multipart/form-data' },
			withCredentials: true
		})
		.then(res2 => {
			return res2.data;
		})
		.catch(() => {
			return { error: "API is down!"}
		});
	return res;
};

export const loginUpdate = async (data: newLoginData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "profile/update/login", data,
		{
			headers: { 'Content-Type': 'multipart/form-data' },
			withCredentials: true
		})
		.then(res2 => {
			return res2.data;
		})
		.catch(() => {
			return { error: "API is down!"}
		});
	return res;
};