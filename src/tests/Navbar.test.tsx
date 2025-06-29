import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { MockedFunction } from 'vitest'
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../routes/components/Navbar';

// Mock react router
const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
	return {
		...actual,
		useNavigate: () => mockedNavigate,
	}
})

// Mock the API module
vi.mock('../routes/api', () => ({
	default: {
		logout: vi.fn(),
	}
}));

// Mock the storage module
vi.mock('../routes/storage', () => ({
	getLocal: vi.fn(),
	removeLocal: vi.fn(),
}));

import API from '../routes/api';
import { getLocal, removeLocal } from '../routes/storage';

const mockedLogout = API.logout as MockedFunction<typeof API.logout>;
const mockedRemoveLocal = removeLocal as MockedFunction<typeof removeLocal>;

describe('Navbar', () => {
	it('shows Login and Sign Up links when not logged in', () => {
		const mockResponse = null;
		const mockedGetLocal = getLocal as MockedFunction<typeof getLocal>;
		mockedGetLocal.mockReturnValue(mockResponse);

		render(<MemoryRouter><Navbar /></MemoryRouter>);

		// Find Login and Sign Up links
		expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/sign up/i).length).toBeGreaterThan(0);
	});

	it('shows username when user is logged in', async () => {
		const mockResponse = { username: "testuser" };
		const mockedGetLocal = getLocal as MockedFunction<typeof getLocal>;
		mockedGetLocal.mockReturnValue(mockResponse);

		render(<MemoryRouter><Navbar /></MemoryRouter>);

		// Expect username to show up
		expect(await screen.findByText('testuser')).toBeInTheDocument();
	});

	it('logs out the user and navigates home', async () => {
		const mockResponse = { username: "testuser" };
		const mockedGetLocal = getLocal as MockedFunction<typeof getLocal>;
		mockedGetLocal.mockReturnValue(mockResponse);

		const user = userEvent.setup();

		render(<MemoryRouter><Navbar /></MemoryRouter>);

		// Open dropdown
		const avatarImg = screen.getByAltText(/user avatar/i);
		const avatarButton = avatarImg.closest('label');
		await user.click(avatarButton!);

		// Click logout
		const logoutBtn = await screen.findByText(/logout/i);
		await user.click(logoutBtn);

		// Check that actions were performed
		await waitFor(() => {
			expect(mockedLogout).toHaveBeenCalled();
			expect(mockedRemoveLocal).toHaveBeenCalledWith('profileData');
			expect(mockedNavigate).toHaveBeenCalledWith('/', { state: { success: 'Successful logout!' } });
		});
	});
});