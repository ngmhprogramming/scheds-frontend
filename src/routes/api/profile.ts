import axios from "axios";

export interface newProfileData {
		username: string,
		full_name: string,
		pfp_url: string,
		email: string,
		password: string,
		bio: string,
};

export const profileUpdate = async (data: newProfileData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "profile/update", data,
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

export const getProfile = async () => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.get(backendAddress + "profile/get", {})
		.then(res => {
			return res.data;
		})
		.catch(() => {
			console.log(res.error);
			return { error: "API is down!"}
		});
	return res;
};