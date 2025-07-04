import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../api';
import { getLocal, removeLocal } from "../storage";

interface ProfileData {
	user_id: string,
	created_at: string,
	username: string,
	pfp_url: string,
	bio: string,
	full_name: string,
}

const Navbar = () => {
	const navigate = useNavigate();

	const [profileData, setProfileData] = useState<ProfileData | null>(null);

	useEffect(() => {
		setProfileData(getLocal("profileData"));
	}, []);

	const handleLogout = async () => {
		await API.logout();
		removeLocal("profileData");
		setProfileData(null);
		navigate("/", { state: { success: "Successful logout!" } });
	};

	return (
		<nav>
			<div className="navbar bg-base-100 shadow-md px-4">
				<div className="flex-1">
					<a className="text-xl font-bold btn btn-ghost normal-case">scheds</a>
				</div>

				{/* Desktop menu */}
				<div className="hidden md:flex gap-2">
					<a className="btn btn-ghost" href="/">Home</a>
					{profileData && (
						<>
							<a className="btn btn-ghost" href="/schedule">Schedule</a>
							<a className="btn btn-ghost" href="/groups">Groups</a>
						</>
					)}
					{!profileData && (
						<>
							<a className="btn btn-ghost" href="/login">Login</a>
							<a className="btn btn-ghost" href="/signup">Sign Up</a>
						</>
					)}
				</div>

				{/* Special items */}
				{profileData && (
					<div className="flex items-center gap-2 ml-2">
						{/* Notifications */}
						<button className="btn btn-ghost btn-circle">
							<div className="indicator">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C8.67 6.165 8 7.388 8 9v5.159c0 .538-.214 1.055-.595 1.436L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9" />
								</svg>
								{/* Unread notifications icon */}
								{/* TODO: Conditional render based on notification status */}
								<span className="badge badge-xs badge-primary indicator-item"></span>
							</div>
						</button>

						{/* Profile picture dropdown */}
						<div className="dropdown dropdown-end">
							<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
								<div className="w-10 rounded-full">
									{/* TODO: Provide fallback image if there is an error */}
									<img
										alt="User avatar"
										src={profileData.pfp_url}
									/>
								</div>
							</label>
							<ul
								tabIndex={0}
								className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
							>
								<li>
									<span className="text-sm font-medium hidden md:inline">
										{profileData.username}
									</span>
								</li>
								<li><a>Profile</a></li>
								<li><a>Settings</a></li>
								<li><a onClick={handleLogout}>Logout</a></li>
							</ul>
						</div>
					</div>
				)}

				{/* Mobile menu */}
				<div className="dropdown dropdown-end md:hidden ml-2">
					<label tabIndex={0} className="btn btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</label>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li><a href="/">Home</a></li>
						{profileData && (
							<>
								<li><a href="/schedule">Schedule</a></li>
							</>
						)}
						{!profileData && (
							<>
								<li><a href="/login">Login</a></li>
								<li><a href="/signup">Sign Up</a></li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;