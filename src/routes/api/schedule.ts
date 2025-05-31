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

export const getEvents = async () => {
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
	await sleep(2000);
	
	return [
		{id: 0, title: 'ee', start: '2025-06-01T01:29:00.000Z', end: '2025-06-01T13:30:00.000Z', description: 'eee'},
		{id: 1, title: 'fff', start: '2025-06-01T01:29:00.000Z', end: '2025-06-01T13:30:00.000Z', description: 'fff'},
	];
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.get(backendAddress + "schedule/get-events",
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