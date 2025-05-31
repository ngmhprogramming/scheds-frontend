import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import API from './api';

type Event = {
	id: number,
	created_at: string,
	user: string,
	title: string,
	start: string,
	end: string,
	description: string,
}

const Schedule = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [form, setForm] = useState({
		title: "",
		start: "",
		end: "",
		description: "",
	});
	const [events, setEvents] = useState<Event[]>([]);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (location.state && (location.state as any).success) {
			setSuccess((location.state).success);
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);

	const fetchEvents = async () => {
		setLoading(true);
		setError("");
		const res = await API.getEvents();
		if ("error" in res) {
			setError(res.error);
		} else {
			console.log(res.data);
			setEvents(res.data);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const localToUTC = (localDateString: string) => {
		const localDate = new Date(localDateString);
		return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value, });
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		const formData = form;
		formData.start = localToUTC(form.start);
		formData.end = localToUTC(form.end);

		const startDatetime = new Date(formData.start);
		const endDatetime = new Date(formData.end);

		if (startDatetime > endDatetime) {
			setError("Start cannot be before end.");
			return;
		}

		if (formData.description.length > 200) {
			setError("Description can be maximum 200 characters.");
			return;
		}

		console.log(formData);

		const res = await API.createEvent(form);
		console.log(res);
		if ("error" in res) {
			setError(res.error);
		} else {
			// setLocal("profileData", res.data);
			navigate("/schedule", { state: { success: "Successful event creation!" } });
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			{success && (
				<div className="bg-base-200 p-4 rounded-lg shadow w-full">
					<div role="alert" className="alert alert-success">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{success}</span>
					</div>
				</div>
			)}
			<form onSubmit={handleSubmit} className="flex-grow bg-base-200 p-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-6">My Schedule</h1>

					<div className="bg-base-100 shadow-md rounded-lg p-6 mb-8">
						<div className="h-96 flex items-center justify-center text-gray-500 italic">
							{loading && (
								<span className="loading loading-bars loading-xl"></span>
							)}
							{!loading && (
								<ul>
									{events.length === 0 && <li>No events found.</li>}
									{events.map((event) => (
										<li key={event.id}>
											<strong>{event.title}</strong> <br />
											From: {new Date(event.start).toLocaleString()} <br />
											To: {new Date(event.end).toLocaleString()} <br />
											{event.description && <em>{event.description}</em>}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>

					<div className="bg-base-100 shadow-md rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4">Add New Event</h2>
						<fieldset className="space-y-4">
							<div className="form-control max-w-sm">
								<label htmlFor="title" className="label">
									<span className="label-text">Event Title</span>
								</label>
								<input
									id="title"
									name="title"
									type="text"
									placeholder="Event title"
									className="input input-bordered w-full"
									value={form.title}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="form-control max-w-sm">
								<label htmlFor="start" className="label">
									<span className="label-text">Start Date and Time</span>
								</label>
								<input
									id="start"
									name="start"
									type="datetime-local"
									className="input input-bordered w-full"
									value={form.start}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="form-control max-w-sm">
								<label htmlFor="end" className="label">
									<span className="label-text">End Date and Time</span>
								</label>
								<input
									id="end"
									name="end"
									type="datetime-local"
									className="input input-bordered w-full"
									value={form.end}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="form-control max-w-lg">
								<label htmlFor="description" className="label">
									<span className="label-text">Description</span>
								</label>
								<textarea
									id="description"
									name="description"
									className="textarea textarea-bordered w-full"
									placeholder="Optional description for event"
									value={form.description}
									onChange={handleChange}
								/>
							</div>

							<button type="submit" className="btn btn-primary">Add Event</button>

							{error && (
								<div role="alert" className="alert alert-error">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>{error}</span>
								</div>
							)}
						</fieldset>
					</div>
				</div>
			</form>
			<Footer />
		</div>
	);
}

export default Schedule;
