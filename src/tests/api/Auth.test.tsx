import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';
import axios from 'axios';
import { signup, login, logout } from '../../routes/api/auth';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

beforeEach(() => {
	mockedAxios.post.mockReset();
});

const backend = import.meta.env.VITE_APP_BACKEND_ADDRESS;

describe('API Auth Functions', () => {
	it('signup returns data on success', async () => {
		const mockData = { username: 'testuser', email: 'test@gmail.com', password: '123456' };
		const mockResponse = {
			"data": {
				"user_id": "301835a4-e164-43cc-baca-073970815057",
				"created_at": "2025-06-28T15:22:03.804418+00:00",
				"username": "testuser",
				"pfp_url": "https://i.pravatar.cc/300",
				"bio": "A scheds user",
				"full_name": "Unknown"
			}
		};
		mockedAxios.post.mockResolvedValueOnce(mockResponse);

		const result = await signup(mockData);

		expect(mockedAxios.post).toHaveBeenCalledWith(
			backend + 'signup',
			mockData,
			expect.objectContaining({ headers: expect.any(Object), withCredentials: true })
		);
		expect(result).toEqual(mockResponse.data);
	});

	it('signup returns error on failure', async () => {
		mockedAxios.post.mockRejectedValueOnce(new Error('API is down!'));

		const result = await signup({ username: 'testuser', email: 'test@gmail.com', password: '123456' });

		expect(result).toEqual({ error: 'API is down!' });
	});

	it('login returns data on success', async () => {
		const mockData = { email: 'test@gmail.com', password: '123456' };
		const mockResponse = {
			"data": {
				"user_id": "301835a4-e164-43cc-baca-073970815057",
				"created_at": "2025-06-28T15:22:03.804418+00:00",
				"username": "testuser",
				"pfp_url": "https://i.pravatar.cc/300",
				"bio": "A scheds user",
				"full_name": "Unknown"
			}
		};

		mockedAxios.post.mockResolvedValueOnce(mockResponse);

		const result = await login(mockData);

		expect(mockedAxios.post).toHaveBeenCalledWith(
			backend + 'login',
			mockData,
			expect.objectContaining({ headers: expect.any(Object), withCredentials: true })
		);
		expect(result).toEqual(mockResponse.data);
	});

	it('login returns error on failure', async () => {
		mockedAxios.post.mockRejectedValueOnce(new Error('API is down!'));

		const result = await login({ email: 'test@gmail.com', password: '123456' });

		expect(result).toEqual({ error: 'API is down!' });
	});

	it('logout returns data on success', async () => {
		const mockResponse = {
			"data": "Successfully logged out!"
		};

		mockedAxios.post.mockResolvedValueOnce(mockResponse);

		const result = await logout();

		expect(mockedAxios.post).toHaveBeenCalledWith(
			backend + 'logout',
			{},
			expect.objectContaining({ withCredentials: true })
		);
		expect(result).toEqual(mockResponse.data);
	});

	it('logout returns error on failure', async () => {
		mockedAxios.post.mockRejectedValueOnce(new Error('API is down!'));

		const result = await logout();

		expect(result).toEqual({ error: 'API is down!' });
	});
});
