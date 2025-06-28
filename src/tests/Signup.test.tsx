import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { MockedFunction } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Signup from '../routes/Signup';

// Mock the API module
vi.mock('../routes/api', () => ({
	default: {
		signup: vi.fn(),
	}
}));

// Mock the storage module
vi.mock('../routes/storage', () => ({
	setLocal: vi.fn(),
	getLocal: vi.fn(),
}));

import API from '../routes/api';
import { setLocal } from '../routes/storage';

describe('Signup Page', () => {
	it('renders all input fields and the submit button', () => {
		render(
			<MemoryRouter>
				<Signup />
			</MemoryRouter>
		);

		// Check that signup form rendered correctly
		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
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
		}
		const mockedSignup = API.signup as MockedFunction<typeof API.signup>;
		mockedSignup.mockResolvedValue(mockResponse);

		render(
			<MemoryRouter initialEntries={['/signup']}>
				<Routes>
					<Route path="/signup" element={<Signup />} />
					<Route path="/" element={<div>Homepage</div>} />
				</Routes>
			</MemoryRouter>
		);

		// Simulate user input
		await user.type(screen.getByLabelText(/username/i), 'testuser');
		await user.type(screen.getByLabelText(/email/i), 'test@example.com');
		await user.type(screen.getByLabelText(/password/i), 'securepass');
		await user.click(screen.getByRole('button', { name: /sign up/i }));

		// Check that API was called
		expect(API.signup).toHaveBeenCalledWith({
			username: 'testuser',
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
	})

	it('displays error message when API.signup returns error', async () => {
		const user = userEvent.setup()

		// Setup mock for API
		const mockResponse = {
			"error": "Username is already taken"
		}
		const mockedSignup = API.signup as MockedFunction<typeof API.signup>;
		mockedSignup.mockResolvedValue(mockResponse);
		render(
			<MemoryRouter>
				<Signup />
			</MemoryRouter>
		)

		// Simulate user input
		await user.type(screen.getByLabelText(/username/i), 'testuser');
		await user.type(screen.getByLabelText(/email/i), 'test@example.com');
		await user.type(screen.getByLabelText(/password/i), 'securepass');
		await user.click(screen.getByRole('button', { name: /sign up/i }));

		// Expect error message to appear
		await waitFor(() => {
			expect(screen.getByRole('alert')).toHaveTextContent(mockResponse.error);
		})
	})
})
