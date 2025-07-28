import axios from "axios";

export interface Notif {
    notif_id: string;
    username: string;
    icon_url: string;
    notif_type: string;
    group_name: string;
    event_name: string;
    inviter_name: string;
    read: boolean;
    accepted: boolean;
    timestamp: string;
    event_time: string;
}

export interface ProfileData {
	user_id: string,
	created_at: string,
	username: string,
	pfp_url: string,
	bio: string,
	full_name: string,
}

export const getNotifs = async (data: ProfileData) => {
    const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
    const res = await axios.post(backendAddress + "notif/get", data, {
		headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
    })
    .then(res2 => {
        return res2.data;
    })
    .catch(() => {
        return { error: "API is down!" }
    });
    return res;
};

export const acceptNotif = async (data: Notif) => {
    const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
    const res = await axios.post(backendAddress + "notif/accept", data, {
		headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
    })
    .then(res2 => {
        return res2.data;
    })
    .catch(() => {
        return { error: "API is down!" }
    });
    return res;
};

export const rejectNotif = async (data: Notif) => {
    const backendAddress = import.meta.env.VITE_APP_BACKEND_ADDRESS;
    const res = await axios.post(backendAddress + "notif/reject", data, {
		headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
    })
    .then(res2 => {
        return res2.data;
    })
    .catch(() => {
        return { error: "API is down!" }
    });
    return res;
};