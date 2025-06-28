import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Root from '../routes/Root';

describe('Root component', () => {
	it('renders the main heading and subtext', () => {
		render(
			<MemoryRouter>
				<Root />
			</MemoryRouter>
		);

		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/scheds/i)
		expect(screen.getByText(/your scheduling companion/i)).toBeInTheDocument()
	});

	it('renders the Get Started button linking to signup', () => {
		render(
			<MemoryRouter>
				<Root />
			</MemoryRouter>
		);

		const button = screen.getByRole('button', { name: /get started/i });
		expect(button).toBeInTheDocument();
	});

	it('renders feature cards', () => {
		render(
			<MemoryRouter>
				<Root />
			</MemoryRouter>
		);

		const smartReminders = screen.getByText(/smart reminders/i);
		const collaborate = screen.getByText(/collaborate easily/i);
		const crossPlatform = screen.getByText(/cross-platform sync/i);
		const customNotifications = screen.getByText(/custom notifications/i);

		expect(smartReminders).toBeInTheDocument();
		expect(collaborate).toBeInTheDocument();
		expect(crossPlatform).toBeInTheDocument();
		expect(customNotifications).toBeInTheDocument();
	});

	it('navigates to /signup when Get Started button is clicked', async () => {
		const SignupStub = () => <div>Signup Page</div>;
		const user = userEvent.setup();

		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route path="/" element={<Root />} />
					<Route path="/signup" element={<SignupStub />} />
				</Routes>
			</MemoryRouter>
		);

		const button = screen.getByRole('button', { name: /get started/i });
		await user.click(button);

		expect(screen.getByText(/signup page/i)).toBeInTheDocument();
	})
});