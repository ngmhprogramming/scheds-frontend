import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import API from './api';

import ICAL from "ical.js";

// calendar imports
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enGB } from 'date-fns/locale/en-GB';
import { parseISO } from "date-fns";

const locales = {
	"en-GB": enGB,
};

const localiser = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

// type Event = {
// 	id: number,
// 	created_at: string,
// 	user: string,
// 	title: string,
// 	start: string,
// 	end: string,
// 	description: string,
// };

interface CalendarEvent {
	title: string;
	start: Date;
	end: Date;
	description: string;
};

const Schedule = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [form, setForm] = useState({
		title: "",
		start: "",
		end: "",
		description: "",
	});
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [icsForm, setIcsForm] = useState(false);

	useEffect(() => {
		if (location.state && (location.state as any).success) {
			setSuccess((location.state).success);
			setForm({
				title: "",
				start: "",
				end: "",
				description: "",
			});
			fetchEvents();
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
			const parsed = res.data.map((event: any) => ({
				title: event.title,
				start: new Date(event.start),
				end: new Date(event.end),
				description: event.description,
			}));
			setEvents(parsed);
			setLoading(false);
		}
		setLoading(false);
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

		if (icsForm) {
			console.log("ics form");
			const fileInput = document.getElementById("icsFile") as HTMLInputElement | null;
			const file = fileInput?.files[0];
			if (!file) return;
			const icsText = await file.text();

			try {
				const jcalData = ICAL.parse(icsText);
				const comp = new ICAL.Component(jcalData);
				const vevents = comp.getAllSubcomponents("vevent");

				const parsedEvents = vevents.map((vevent) => {
					const event = new ICAL.Event(vevent);
					return {
						title: event.summary,
						start: event.startDate.toJSDate().toISOString(),
						end: event.endDate.toJSDate().toISOString(),
						description: event.description,
					};
				});

				// consider removing this and just sending JSON straight
				const formData = new FormData();
				formData.append("events", JSON.stringify(parsedEvents));

				const res = await API.createEvents(formData);
				if ("error" in res) {
					setError(res.error);
				} else {
					fileInput.value = "";
					navigate("/schedule", { state: { success: "Successfully uploaded events!" } });
				}
			} catch (err) {
				setError("Failed to parse ICS file.");
				return;
			}
		} else {

			const formData = form;
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

			const res = await API.createEvent(form);
			console.log(res);
			if ("error" in res) {
				setError(res.error);
			} else {
				navigate("/schedule", { state: { success: "Successful event creation!" } });
			}
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
			<div className="flex-grow bg-base-200 p-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-6">My Schedule</h1>
					<div className="bg-base-100 shadow-md rounded-lg p-6 mb-8">
						<div className="min-h-[500px] flex items-center justify-center text-gray-500 italic">
							{loading && (
								<span className="loading loading-bars loading-xl"></span>
							)}
							{!loading && (
								<>
									{/* <span>event debug</span>
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
									</ul> */}
									<div className="rbc-calendar-wrapper w-full">
										<Calendar
											localizer={localiser}
											events={events}
											startAccessor="start"
											endAccessor="end"
											style={{ height: 500 }}
										/>
									</div>
								</>
							)}
						</div>
					</div>
					<form onSubmit={handleSubmit} className="bg-base-100 shadow-md rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4">Add New Event</h2>

						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text font-medium mb-2">Event Input Method</span>
							</label>
							<div className="flex gap-4">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name="inputMethod"
										className="radio radio-primary"
										checked={!icsForm}
										onChange={() => setIcsForm(false)}
									/>
									<span className="label-text">Manual Input</span>
								</label>

								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name="inputMethod"
										className="radio radio-primary"
										checked={icsForm}
										onChange={() => setIcsForm(true)}
									/>
									<span className="label-text">Upload .ics File</span>
								</label>
							</div>
						</div>

						<fieldset className="space-y-4">
							{icsForm ? (
								<div className="form-control max-w-sm">
									<label htmlFor="icsFile" className="label">
										<span className="label-text">Upload .ics File</span>
									</label>
									<input
										id="icsFile"
										name="icsFile"
										type="file"
										accept=".ics"
										className="file-input file-input-bordered w-full"
										required
									/>
								</div>
							) : (
								<>
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
								</>
							)}

							<button type="submit" className="btn btn-primary">
								Add Event
							</button>

							{error && (
								<div role="alert" className="alert alert-error">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>{error}</span>
								</div>
							)}
						</fieldset>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Schedule;
