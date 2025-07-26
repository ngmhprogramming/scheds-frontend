import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import API from './api';
import { getLocal, setLocal, removeLocal } from "./storage";

interface ProfileData {
	user_id: string,
	created_at: string,
	username: string,
	pfp_url: string,
	bio: string,
	full_name: string,
}

const Profile = () => {
	const navigate = useNavigate();
	const location = useLocation();
	
	const [profileData, setProfileData] = useState<ProfileData | null>(null);

	useEffect(() => {
		setProfileData(getLocal("profileData"));
	}, []);

	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});
	const [profileForm, setProfileForm] = useState({
		username: "",
		full_name: "",
		pfp_url: "",
		bio: "",
	});
	const [success, setSuccess] = useState<string | null>(null);
	useEffect(() => {
		if (location.state && (location.state as any).success) {
			setSuccess((location.state).success);
			window.history.replaceState({}, document.title);
		}
	}, [location.state]);
	const [profileError, setProfileError] = useState("");
	const [loginError, setLoginError] = useState("");

	const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setLoginForm({ ...loginForm, [event.target.name]: event.target.value, });
	};
	const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setProfileForm({ ...profileForm, [event.target.name]: event.target.value, });
	};

	const handleLoginSubmit = async (event: React.FormEvent) => {
		console.log("submitting login update");
		event.preventDefault();
		setLoginError("");

		const res = await API.loginUpdate(loginForm);
		console.log("submitting");
		if ("error" in res) {
			setLoginError(res.error);
			console.log("earlier error");
		} else {
			await API.logout();
			removeLocal("profileData");
			setProfileData(null);
			navigate("/login", { state: { loginUpdate: "Successful login update! Please check your email for a verification email, then log in again." } });
		}
	};

	const handleProfileSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setProfileError("");

		const res = await API.profileUpdate(profileForm);
		// console.log("submitting");
		// if ("error" in res) {
		// 	setProfileError(res.error);
		// } else {
		// 	const updatedProfile = await API.getProfile();
		// 	if ("error" in updatedProfile) {
		// 		setProfileError(updatedProfile.error);
		// 	} else {
		// 		console.log("updating profileData");
		// 		removeLocal("profileData");
		// 		setLocal("profileData", updatedProfile.data);
		// 		setProfileData(getLocal("profileData"));
		// 	}
		// }
		if ("error" in res) {
			setProfileError(res.error);
			return;
		}
		var newProfile = await getLocal<ProfileData>("profileData");
		if (newProfile == null) {
			setProfileError("Profile data not found, please log in again.");
			return;
		}
		newProfile.username = profileForm.username == "" ? newProfile.username : profileForm.username;
		newProfile.full_name = profileForm.full_name == "" ? newProfile.full_name : profileForm.full_name;
		newProfile.pfp_url = profileForm.pfp_url == "" ? newProfile.pfp_url : profileForm.pfp_url;
		newProfile.bio = profileForm.bio == "" ? newProfile.bio : profileForm.bio;
		setLocal("profileData", newProfile);
		navigate("/profile", { state: { success: "Successful profile update!" } });
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
								<>
									<form onSubmit={handleProfileSubmit} className="bg-base-100 shadow-md rounded-lg p-6 pr-20">
										<fieldset className="space-y-4">
											<h1 className="text-xl font-bold mb-6">Update Profile</h1>
											<div className="w-30 pr-4 rounded-full hover:opacity-20">
												{/* TODO: Provide fallback image if there is an error */}
												<img
													alt="User avatar"
													src={profileData.pfp_url}
												/>
											</div>
											<div className="form-control max-w-sm">
												<label htmlFor="pfp_url" className="label">
													<span className="label-text">New Profile Picture URL</span>
												</label>
												<input
													id="pfp_url"
													name="pfp_url"
													type="text"
													placeholder={profileData.pfp_url}
													className="input input-bordered w-full"
													value={profileForm.pfp_url}
													onChange={handleProfileChange}
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
													value={profileForm.username}
													onChange={handleProfileChange}
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
													value={profileForm.full_name}
													onChange={handleProfileChange}
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
													value={profileForm.bio}
													onChange={handleProfileChange}
												/>
											</div>

											<button type="submit" className="btn btn-primary">Update Profile</button>

											{profileError && (
												<div role="alert" className="alert alert-error">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													<span>{profileError}</span>
												</div>
											)}
										</fieldset>
									</form>
									<form onSubmit={handleLoginSubmit} className="bg-base-100 shadow-md rounded-lg p-6">
										<fieldset className="space-y-4">
											<h1 className="text-xl font-bold mb-6">Update Login Details</h1>
											<div className="form-control max-w-sm">
												<label htmlFor="email" className="label">
													<span className="label-text">Email</span>
												</label>
												<input
													id="email"
													name="email"
													type="email"
													className="input input-bordered w-full"
													value={loginForm.email}
													onChange={handleLoginChange}
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
													value={loginForm.password}
													onChange={handleLoginChange}
												/>
											</div>

											<button type="submit" className="btn btn-primary">Update Login Details</button>

											{loginError && (
												<div role="alert" className="alert alert-error">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													<span>{loginError}</span>
												</div>
											)}
										</fieldset>
									</form>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Profile;
