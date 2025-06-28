import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';
import axios from 'axios';

import { createEvent, getEvents } from '../../routes/api/schedule';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

beforeEach(() => {
	mockedAxios.post.mockReset();
	mockedAxios.get.mockReset();
});

describe('API createEvent', () => {
	it('returns data on success', async () => {
		const mockResponse = {
			"data": "Success"
		};
		mockedAxios.post.mockResolvedValueOnce(mockResponse);

		const result = await createEvent({
			title: 'Meeting',
			start: '2025-06-30T10:00:00Z',
			end: '2025-06-30T11:00:00Z',
			description: 'Project sync',
		});

		expect(mockedAxios.post).toHaveBeenCalledWith(
			expect.stringContaining('schedule/create-event'),
			expect.any(Object),
			expect.objectContaining({
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true
			})
		);
		expect(result).toEqual(mockResponse.data);
	});

	it('returns error on failure', async () => {
		mockedAxios.post.mockRejectedValueOnce(new Error('API is down!'));

		const result = await createEvent({
			title: 'Failing Event',
			start: '2025-06-30T12:00:00Z',
			end: '2025-06-30T13:00:00Z',
			description: 'This will fail',
		});

		expect(result).toEqual({ error: 'API is down!' });
	});
});

describe('API getEvents', () => {
	it('returns events on success', async () => {
		const mockResponse = {
			"data": [
				{
					"id": 1,
					"created_at": "2025-06-28T09:30:59.515874+00:00",
					"user": "315fc599-bbd3-4b07-a221-8068ef546429",
					"title": "Meeting",
					"start": "2025-06-01T00:56:00+00:00",
					"end": "2025-06-01T12:56:00+00:00",
					"description": "A Meeting"
				},
			]
		};
		mockedAxios.get.mockResolvedValueOnce(mockResponse);

		const result = await getEvents();

		expect(mockedAxios.get).toHaveBeenCalledWith(
			expect.stringContaining('schedule/events'),
			expect.objectContaining({
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true
			})
		);
		expect(result).toEqual(mockResponse.data);
	});

	it('returns error on failure', async () => {
		mockedAxios.get.mockRejectedValueOnce(new Error('API is down!'));

		const result = await getEvents();

		expect(result).toEqual({ error: 'API is down!' });
	});
});
