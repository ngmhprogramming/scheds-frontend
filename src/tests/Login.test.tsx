import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../routes/Login';

// Mock the API module
vi.mock('../routes/api', () => ({
	default: {
		login: vi.fn(),
	}
}));

// Mock the storage module
vi.mock('../routes/storage', () => ({
	setLocal: vi.fn(),
	getLocal: vi.fn(),
}));

import API from '../routes/api';
import { setLocal } from '../routes/storage';

describe('Login Page', () => {
	it('renders all input fields and the submit button', () => {
		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>
		);

		// Check that signup form rendered correctly
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
	});

	it('allows user to fill the form and submit successfully', async () => {
		const user = userEvent.setup()

		// Setup mock for API
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
		const mockedLogin = API.login as MockedFunction<typeof API.login>;
		mockedLogin.mockResolvedValue(mockResponse);

		render(
			<MemoryRouter initialEntries={['/login']}>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<div>Homepage</div>} />
				</Routes>
			</MemoryRouter>
		);

		// Simulate user input
		await user.type(screen.getByLabelText(/email/i), 'test@example.com');
		await user.type(screen.getByLabelText(/password/i), 'securepass');
		await user.click(screen.getByRole('button', { name: /login/i }));

		// Check that API was called
		expect(API.login).toHaveBeenCalledWith({
			email: 'test@example.com',
			password: 'securepass',
		});

		// Check that setLocal called with profile data
		await waitFor(() => {
			expect(setLocal).toHaveBeenCalledWith('profileData', mockResponse.data);
		});

		// Check for navigation to "/" by checking homepage render
		await waitFor(() => {
			expect(screen.getByText(/homepage/i)).toBeInTheDocument();
		});
	});

	it('displays error message when API.login returns error', async () => {
		const user = userEvent.setup()

		// Setup mock for API
		const mockResponse = {
			"error": "Invalid login credentials."
		};
		const mockedLogin = API.login as MockedFunction<typeof API.login>;
		mockedLogin.mockResolvedValue(mockResponse);

		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>
		);

		// Simulate user input
		await user.type(screen.getByLabelText(/email/i), 'test@example.com');
		await user.type(screen.getByLabelText(/password/i), 'securepass');
		await user.click(screen.getByRole('button', { name: /login/i }));

		// Expect error message to appear
		await waitFor(() => {
			expect(screen.getByRole('alert')).toHaveTextContent(mockResponse.error);
		});
	});
});
