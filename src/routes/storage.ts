export const setLocal = <T>(key: string, value: T) : void => {
	localStorage.setItem(key, JSON.stringify(value));
}

export const getLocal = <T>(key: string) : T | null => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) as T : null;
}

export const removeLocal = (key : string) : void => {
	localStorage.removeItem(key);
}