import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import API from './api';
import { getLocal, removeLocal } from "./storage";

// calendar imports
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enGB } from 'date-fns/locale/en-GB';
import { parseISO } from "date-fns";

interface ProfileData {
	user_id: string,
	created_at: string,
	username: string,
	pfp_url: string,
	bio: string,
	full_name: string,
}

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
	
	const [profileData, setProfileData] = useState<ProfileData | null>(null);

	useEffect(() => {
		setProfileData(getLocal("profileData"));
	}, []);

	const [form, setForm] = useState({
		username: "",
		full_name: "",
		pfp_url: "",
		email: "",
		password: "",
		bio: "",
	});
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (location.state && (location.state as any).success) {
			setSuccess((location.state).success);
			setForm({
				username: profileData ? profileData.username : "",
				full_name: profileData ? profileData.full_name : "",
				pfp_url: profileData ? profileData.pfp_url : "",
				email: "",
				password: "",
				bio: profileData ? profileData.bio : "",
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

		const res = await API.profileUpdate(form);
		console.log(res);
		if ("error" in res) {
			setError(res.error);
		} else {
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
			<div className="flex-grow bg-base-200 p-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-6">My Profile</h1>
					<div className="bg-base-100 shadow-md rounded-lg p-6 mb-8">
						<div className="min-h-[500px] flex">
							{profileData && (
								<form onSubmit={handleSubmit} className="bg-base-100 shadow-md rounded-lg p-6">
									<fieldset className="space-y-4">
										<div className="w-30 pr-4 rounded-full">
											{/* TODO: Provide fallback image if there is an error */}
											<img
												alt="User avatar"
												src={profileData.pfp_url}
											/>
										</div>

										<div className="form-control max-w-sm">
											<label htmlFor="username" className="label">
												<span className="label-text">Username</span>
											</label>
											<input
												id="username"
												name="username"
												type="text"
												placeholder={profileData.username}
												className="input input-bordered w-full"
												value={form.username}
												onChange={handleChange}
											/>
										</div>

										<div className="form-control max-w-sm">
											<label htmlFor="full_name" className="label">
												<span className="label-text">Full Name</span>
											</label>
											<input
												id="full_name"
												name="full_name"
												type="text"
												placeholder={profileData.full_name}
												className="input input-bordered w-full"
												value={form.full_name}
												onChange={handleChange}
											/>
										</div>

										<div className="form-control max-w-sm">
											<label htmlFor="email" className="label">
												<span className="label-text">Email</span>
											</label>
											<input
												id="email"
												name="email"
												type="email"
												className="input input-bordered w-full"
												value={form.email}
												onChange={handleChange}
												required
											/>
										</div>

										<div className="form-control max-w-sm">
											<label htmlFor="password" className="label">
												<span className="label-text">Password</span>
											</label>
											<input
												id="password"
												name="password"
												type="password"
												className="input input-bordered w-full"
												value={form.password}
												onChange={handleChange}
												required
											/>
										</div>

										<div className="form-control max-w-lg">
											<label htmlFor="bio" className="label">
												<span className="label-text">Bio</span>
											</label>
											<textarea
												id="bio"
												name="bio"
												className="textarea textarea-bordered w-full"
												placeholder={profileData.bio}
												value={form.bio}
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
								</form>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Schedule;
