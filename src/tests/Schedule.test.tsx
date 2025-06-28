import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Schedule from '../routes/Schedule';

// Mock API
vi.mock('../routes/api', () => ({
	default: {
		getEvents: vi.fn(),
		createEvent: vi.fn(),
	},
}));

// Mock useNavigate and useLocation
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
	return {
		...actual,
		useNavigate: () => vi.fn(),
		useLocation: () => ({ state: undefined }),
	}
})

import API from '../routes/api'

const mockedGetEvents = API.getEvents as MockedFunction<typeof API.getEvents>;
const mockedCreateEvent = API.createEvent as MockedFunction<typeof API.createEvent>;


describe('Schedule Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders calendar and form', async () => {
		mockedGetEvents.mockResolvedValueOnce({ data: [] });

		render(<MemoryRouter><Schedule /></MemoryRouter>);

		expect(await screen.findByText(/My Schedule/i)).toBeInTheDocument();
		expect(await screen.findByText(/Add New Event/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Event Title/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Start Date and Time/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/End Date and Time/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Add Event/i })).toBeInTheDocument();
	});

	it('loads and displays events', async () => {
		mockedGetEvents.mockResolvedValueOnce({
			data: [
				{
					"id": 1,
					"created_at": "2025-06-28T09:30:59.515874+00:00",
					"user": "315fc599-bbd3-4b07-a221-8068ef546429",
					"title": "Meeting",
					"start": "2025-06-01T00:56:00+00:00",
					"end": "2025-06-01T12:56:00+00:00",
					"description": "A Meeting"
				}
			],
		})

		render(<MemoryRouter><Schedule /></MemoryRouter>);

		// Event should show up in calendar
		await waitFor(() => {
			expect(screen.queryByText('Meeting')).toBeTruthy();
		});
	});

	it('shows error if getEvents fails', async () => {
		mockedGetEvents.mockResolvedValueOnce({ error: 'API is down!' });

		render(<MemoryRouter><Schedule /></MemoryRouter>);

		expect(await screen.findByText('API is down!')).toBeInTheDocument();
	});

	it('submits form and creates event', async () => {
		mockedGetEvents.mockResolvedValueOnce({ data: [] });
		mockedCreateEvent.mockResolvedValueOnce({ data: {} });

		const user = userEvent.setup();
		render(<MemoryRouter><Schedule /></MemoryRouter>);

		await user.type(screen.getByLabelText(/Event Title/i), 'Test Event')
		await user.type(screen.getByLabelText(/Start Date and Time/i), '2025-06-30T09:00')
		await user.type(screen.getByLabelText(/End Date and Time/i), '2025-06-30T10:00')
		await user.type(screen.getByLabelText(/Description/i), 'Testing event creation')

		await user.click(screen.getByRole('button', { name: /Add Event/i }));

		await waitFor(() => {
			expect(mockedCreateEvent).toHaveBeenCalledWith({
				title: "Test Event",
				start: "2025-06-30T09:00:00.000Z",
				end: "2025-06-30T10:00:00.000Z",
				description: "Testing event creation",
			});
		});
	});

	it('shows validation error when start > end', async () => {
		mockedGetEvents.mockResolvedValueOnce({ data: [] });

		const user = userEvent.setup();
		render(<MemoryRouter><Schedule /></MemoryRouter>);

		await user.type(screen.getByLabelText(/Event Title/i), 'Invalid Event');
		await user.type(screen.getByLabelText(/Start Date and Time/i), '2025-06-30T12:00');
		await user.type(screen.getByLabelText(/End Date and Time/i), '2025-06-30T10:00');
		await user.click(screen.getByRole('button', { name: /Add Event/i }));

		expect(await screen.findByText(/Start cannot be before end/i)).toBeInTheDocument();
	})

	it('shows validation error when description length exceeds 200 characters', async () => {
		mockedGetEvents.mockResolvedValueOnce({ data: [] });

		const user = userEvent.setup();
		render(<MemoryRouter><Schedule /></MemoryRouter>);

		await user.type(screen.getByLabelText(/Event Title/i), 'Invalid Event');
		await user.type(screen.getByLabelText(/Start Date and Time/i), '2025-06-30T09:00');
		await user.type(screen.getByLabelText(/End Date and Time/i), '2025-06-30T10:00');
		await user.type(screen.getByLabelText(/Description/i), 'X'.repeat(250));
		await user.click(screen.getByRole('button', { name: /Add Event/i }));

		expect(await screen.findByText(/Description can be maximum 200 characters\./i)).toBeInTheDocument();
	});
});