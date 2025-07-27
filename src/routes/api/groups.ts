import axios from "axios";

export interface CreateGroupData {
	name: string,
}

export interface AddUserData {
	inviter: string,
	groupId: string | undefined,
	username: string,
}

export interface GetMembersData {
	groupId: string,
}

export interface FindSlotsData {
	groupId: string,
	searchStart: string,
	searchEnd: string,
	eventLength: number,
	earliestHour?: number | null,
	latestHour?: number | null,
	interval?: number | null,
	maxResults?: number | null,
};

export const createGroup = async (data : CreateGroupData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "group/create", data,
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

export const addUser = async (data : AddUserData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "group/add-member", data,
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

export const getGroups = async () => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.get(backendAddress + "group/get-groups",
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

export const getMembers = async (data: GetMembersData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "group/get-members", data,
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

export const findSlots = async (data : FindSlotsData) => {
	const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
	const res = await axios.post(backendAddress + "group/schedule-event", data,
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