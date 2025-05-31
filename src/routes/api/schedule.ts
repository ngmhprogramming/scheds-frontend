import axios from "axios";

export interface CreateEventData {
	title: string,
	start: string,
	end: string,
	description: string,
};

export const createEvent = async (data: CreateEventData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "schedule/create-event", data,
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