import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import API from './api';
import { getLocal } from "./storage";

// calendar imports
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enGB } from 'date-fns/locale/en-GB';
import { parseISO } from "date-fns";
import type { GetMembersData, FindSlotsData } from './api/groups';

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

type Group = {
	group_id: string;
	name: string;
	icon_url: string;
}

type Member = {
	user_id: string;
	created_at: string;
	username: string;
	pfp_url: string;
	bio: string;
	full_name: string;
}

type SchedulerForm = {
	groupId: string | undefined;
	searchStart: string;
	searchEnd: string;
	eventLength: number;
	earliestHour?: number | null;
	latestHour?: number | null;
	interval?: number | null;
	maxResults?: number | null;
};

interface ProfileData {
	user_id: string,
	created_at: string,
	username: string,
	pfp_url: string,
	bio: string,
	full_name: string,
}

const Groups = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const createGroupDialogRef = useRef<HTMLDialogElement>(null);
	const addUserDialogRef = useRef<HTMLDialogElement>(null);

	const [form, setForm] = useState({
		title: "",
		start: "",
		end: "",
		description: "",
	});

	const toLocalDateTimeString = (date = new Date()) => {
		const offsetMs = date.getTimezoneOffset() * 60000;
		const localISOTime = new Date(date.getTime() - offsetMs).toISOString().slice(0,16);
		return localISOTime;
	};
	const [schedulerForm, setSchedulerForm] = useState<SchedulerForm>({
		groupId: "",
		searchStart: toLocalDateTimeString(),
		searchEnd: toLocalDateTimeString(new Date(Date.now() + 86400000)),
		eventLength: 0,
		earliestHour: 0,
		latestHour: 24,
		interval: 30,
		maxResults: 10,
	});
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
	const [groups, setGroups] = useState<Group[]>([]);
	const [groupsLoading, setGroupsLoading] = useState(false);

	const [members, setMembers] = useState<Member[] | null>(null);
	const [membersLoading, setMembersLoading] = useState(false);

	const [schedulerOutput, setSchedulerOutput] = useState(null);
	const [schedulerLoading, setSchedulerLoading] = useState(false);

	const [profileData, setProfileData] = useState<ProfileData | null>(null);

	useEffect(() => {
		setProfileData(getLocal("profileData"));
		if (location.state && (location.state as any).success) {
			setSuccess((location.state).success);
			setForm({
				title: "",
				start: "",
				end: "",
				description: "",
			});
			setSelectedGroup(null);
			fetchGroups();
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
				start: parseISO(event.start),
				end: parseISO(event.end),
				description: event.description,
			}));
			setEvents(parsed);
			setLoading(false);
		}
	};

	const fetchGroups = async () => {
		setGroupsLoading(true);
		setError("");
		const res = await API.getGroups();
		if ("error" in res) {
			setError(res.error);
		} else {
			setGroups(res.data);
			setGroupsLoading(false);
		}
	};

	const fetchMembers = async (data: GetMembersData) => {
		setMembersLoading(true);
		setError("");
		const res = await API.getMembers(data);
		if ("error" in res) {
			setError(res.error);
		} else {
			console.log(res.data);
			setMembers(res.data);
			setMembersLoading(false);
		}
	};

	useEffect(() => {
		fetchGroups();
		fetchEvents();
	}, []);

	const localToUTC = (localDateString: string) => {
		const localDate = new Date(localDateString);
		return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value, });
	};

	const handleSchedulerChange = (e) => {
		setSchedulerForm({ ...schedulerForm, [e.target.name]: e.target.value });
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
			navigate("/schedule", { state: { success: "Successful event creation!" } });
		}
	};

	
	const handleSchedulerSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setSchedulerLoading(true);
		setError("");

		const formData = schedulerForm;
		formData.groupId = selectedGroup?.group_id;
		
		const fieldsToParse = ['eventLength', 'earliestHour', 'latestHour', 'interval', 'maxResults'];
		const cleaned = Object.fromEntries(
			Object.entries(formData)
			  .filter(([_, v]) => v != null && v !== '')
			  .map(([k, v]) => [k, fieldsToParse.includes(k) ? Number(v) : v])
		  ) as unknown as FindSlotsData;

		const res = await API.findSlots(cleaned);
		
		console.log(res);
		if ("error" in res) {
			setError(res.error);
		} else {
			setSchedulerLoading(false);
			setSchedulerOutput(res.data);
		}
	};

	const handleCreateGroup = async (e : React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const groupNameInput = form.elements.namedItem("new_group_name") as HTMLInputElement;
		const groupName = groupNameInput.value;
	
		// console.log("Creating group:", groupName);
		const res = await API.createGroup({ name: groupName });
		// console.log("Group created!");
	
		createGroupDialogRef.current?.close();
		fetchGroups();
	};

	const handleAddUser = async (e : React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const usernameInput = form.elements.namedItem("user_username") as HTMLInputElement;
		const username = usernameInput.value;
	
		// console.log("Adding user", username);
		if (!profileData) {
			console.error("No profile data available");
			return;
		}
		const res = await API.addUser({ inviter: profileData.username, groupId: selectedGroup?.group_id, username: username });
		// console.log("User added!");

		addUserDialogRef.current?.close();
	};

	const handleSelectedGroup = (group : Group) => {
		setSelectedGroup(group);
		fetchMembers({ groupId: group.group_id });
	}

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			{/* Success Alert */}
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
			{/* body */}
			<div className="flex flex-grow bg-base-200 p-6">
				<div className="m-auto ml-40">
					<div className="flex flex-row max-w-4xl justify-center">
						{/* left column */}
						<div className="pr-4 flex flex-col basis-1">
							<div className="flex flex-row justify-between">
								<h1 className="text-3xl font-bold mb-6">My Groups</h1>
								{/* create group button */}
								<button
									className="btn btn-circle"
									onClick={() => createGroupDialogRef.current?.showModal()}
								>
									<img src="https://cdn-icons-png.flaticon.com/512/60/60732.png" style={{filter:"invert(1)"}}></img>
								</button>
								<dialog ref={createGroupDialogRef} className="modal">
									<div className="modal-box">
										<h3 className="font-bold text-lg mb-4">Create a New Group</h3>
										
										<form method="dialog" className="space-y-4" onSubmit={handleCreateGroup}>
										<input
											id="new_group_name"
											name="new_group_name"
											type="text"
											placeholder="Enter group name"
											className="input input-bordered w-full"
											required
										/>
										<div className="modal-action">
											<button type="submit" className="btn btn-primary">Create</button>
											<button type="button" className="btn" onClick={() => createGroupDialogRef.current?.close()}>Cancel</button>
										</div>
										</form>
									</div>
								</dialog>
							</div>
							{/* groups list */}
							<div className="bg-base-100 shadow-md rounded-lg mb-8 overflow-y-auto max-h-0.7">
								{ groupsLoading && (
									<div className="flex justify-center items-center w-full py-12">
										<span className="loading loading-bars loading-lg"></span>
									</div>
								)}
								{!groupsLoading && (
									<>
									{
										groups.map(group => {
											// group list element
											const isSelected = selectedGroup?.group_id === group.group_id;
											return (
												<div
													key={group.group_id}
													onClick={() => handleSelectedGroup(group)}
													className={`flex items-center gap-4 p-4 rounded-lg shadow min-w-sm cursor-pointer transition-colors
														${isSelected ? "bg-primary text-primary-content" : "bg-base-100 hover:bg-base-200"}`}
												>
												<img
												src={group.icon_url}
												alt="Group Icon"
												className="w-12 h-12 rounded-full"
												/>
												<span className="text-lg font-semibold">{group.name}</span>
											</div>
											);
										})
									}
									</>
								)}
								
							</div>
						</div>
						{/* middle column */}
						{ (selectedGroup != null) && (
						<div className="min-w-3xl basis-6 flex flex-row">
							<div className="flex flex-col min-w-3xl pr-6 overflow-y-auto h-full max-h-0.9">
								<div className="flex justify-between items-start mb-6">
									<div>
										<h1 className="text-3xl font-bold">{selectedGroup.name}</h1>
										<p className="text-sm text-gray-500">Group ID: {selectedGroup.group_id}</p>
									</div>
									<button
										className="btn btn-circle"
										onClick={() => addUserDialogRef.current?.showModal()}
									>
										<img
											src="https://icons.veryicon.com/png/o/internet--web/sesame-treasure/invite-friends.png"
											style={{ filter: "invert(1)" }}
											alt="Invite"
											/>
									</button>
									<dialog ref={addUserDialogRef} className="modal">
										<div className="modal-box">
											<h3 className="font-bold text-lg mb-4">Add a user to {selectedGroup.name}</h3>
											
											<form method="dialog" className="space-y-4" onSubmit={handleAddUser}>
											<input
												id="user_username"
												name="user_username"
												type="text"
												placeholder="Enter username"
												className="input input-bordered w-full"
												required
											/>
											<div className="modal-action">
												<button type="submit" className="btn btn-primary">Add</button>
												<button type="button" className="btn" onClick={() => addUserDialogRef.current?.close()}>Cancel</button>
											</div>
											</form>
										</div>
									</dialog>
								</div>
								<div className="bg-base-100 shadow-md rounded-lg p-6 mb-8 overflow-y-auto max-h-0.7">
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
								 {/* Scheduler Form */}
								<form onSubmit={handleSchedulerSubmit} className="bg-base-100 shadow-md rounded-lg p-6">
								<h2 className="text-xl font-semibold mb-4">Find Common Timeslot</h2>
								<fieldset className="space-y-4">
									
									{/* Row: Start Date and End Date */}
									<div className="flex gap-4 max-w-2xl">
									<div className="form-control w-full">
										<label className="label">Search Start Datetime</label>
										<input
										type="datetime-local"
										name="searchStart"
										className="input input-bordered w-full"
										value={schedulerForm.searchStart}
										onChange={handleSchedulerChange}
										required
										/>
									</div>
									<div className="form-control w-full">
										<label className="label">Search End Datetime</label>
										<input
										type="datetime-local"
										name="searchEnd"
										className="input input-bordered w-full"
										value={schedulerForm.searchEnd}
										onChange={handleSchedulerChange}
										required
										/>
									</div>
									</div>

									{/* Duration */}
									<div className="form-control max-w-sm">
									<label className="label">Event Duration (minutes)</label>
									<input
										type="number"
										name="eventLength"
										className="input input-bordered w-full"
										value={schedulerForm.eventLength}
										onChange={handleSchedulerChange}
										min={1}
										required
									/>
									</div>

									{/* Row: Earliest and Latest Start Hour */}
									<div className="flex gap-4 max-w-2xl">
									<div className="form-control w-full">
										<label className="label">Earliest Start Hour (0–24)</label>
										<input
										type="number"
										name="earliestHour"
										className="input input-bordered w-full"
										value={schedulerForm.earliestHour}
										onChange={handleSchedulerChange}
										min={0}
										max={24}
										/>
									</div>
									<div className="form-control w-full">
										<label className="label">Latest Start Hour (0–24)</label>
										<input
										type="number"
										name="latestHour"
										className="input input-bordered w-full"
										value={schedulerForm.latestHour}
										onChange={handleSchedulerChange}
										min={0}
										max={24}
										/>
									</div>
									</div>

									{/* Interval and Max Results */}
									<div className="form-control max-w-sm">
									<label className="label">Search Interval (minutes)</label>
									<input
										type="number"
										name="interval"
										className="input input-bordered w-full"
										value={schedulerForm.interval}
										onChange={handleSchedulerChange}
										min={1}
									/>
									</div>

									<div className="form-control max-w-sm">
									<label className="label">Max Results</label>
									<input
										type="number"
										name="maxResults"
										className="input input-bordered w-full"
										value={schedulerForm.maxResults}
										onChange={handleSchedulerChange}
										min={1}
									/>
									</div>

									<button type="submit" className="btn btn-primary">Search Slots</button>
								</fieldset>
								</form>
								<div className="space-y-4">
									{ schedulerLoading && (
										<div className="flex justify-center items-center w-full py-12">
											<span className="loading loading-bars loading-lg"></span>
										</div>
									)}
									{!schedulerLoading && (schedulerOutput != null) && (
										<>										
										<h3 className="text-xl font-semibold mb-4">Candidate Timeslots</h3>
										{
										schedulerOutput.map((slot, idx) => {
											const startLocal = new Date(slot.start).toLocaleString();
											const endLocal = new Date(slot.end).toLocaleString();

											return (
											<div key={idx} className="p-4 bg-base-100">
												<div className="font-semibold text-lg mb-1">
												{startLocal} - {endLocal}
												</div>
												<div className="mb-2">
												Available users ({slot.numAvailable}):
												</div>
												<ul className="list-disc list-inside">
												{slot.availableUsers.map((user, i) => (
													<li key={i}>{user}</li>
												))}
												</ul>
											</div>
											);
										})
									}
										</>
									)}
								</div>
								{/* <form onSubmit={handleSubmit} className="bg-base-100 shadow-md rounded-lg p-6">
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
								</form> */}
							</div>
							{/* right column */}
							<div className="pr-4 flex flex-col justify-start basis-1">
								<div className="flex flex-row justify-between">
									<h1 className="text-3xl font-bold mb-6">Members</h1>
								</div>
								{/* groups list */}
								<div className="bg-base-100 shadow-md rounded-lg mb-8 overflow-y-auto max-h-0.7">
									{ membersLoading && (
										<div className="flex justify-center items-center w-full py-12">
											<span className="loading loading-bars loading-lg"></span>
										</div>
									)}
									{!membersLoading && (
										<>
										{
											members.map(member => {
												return (
													<div
														className={`flex items-center gap-4 p-4 rounded-lg shadow min-w-sm cursor-pointer transition-colors
														bg-base-100 hover:bg-base-200`}
													>
													<img
													src={member.pfp_url}
													alt="Group Icon"
													className="w-12 h-12 rounded-full"
													/>
													<span className="text-lg font-semibold">{member.username}</span>
												</div>
												);
											})
										}
										</>
									)}
									
								</div>
							</div>
						</div>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Groups;
