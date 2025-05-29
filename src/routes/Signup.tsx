import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import * as API from './api/auth';

const Signup = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value, });
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");

		const res = await API.signup(form);
		if ("error" in res) {
			setError(res.error);
		} else {
			localStorage.setItem("username", res.data);
			navigate("/");
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<form
				onSubmit={handleSubmit}
				className="card shadow-xl p-6 space-y-4 flex-grow flex items-center justify-center bg-base-200"
			>
				<fieldset className="space-y-4 border border-base-300 rounded-lg p-4">
					<legend className="text-2xl font-semibold px-2">Sign Up</legend>

					<div className="form-control">
						<label htmlFor="username" className="label">
							<span className="label-text">Username</span>
						</label>
						<input
							id="username"
							name="username"
							type="text"
							className="input input-bordered"
							value={form.username}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-control">
						<label htmlFor="email" className="label">
							<span className="label-text">Email</span>
						</label>
						<input
							id="email"
							name="email"
							type="email"
							className="input input-bordered"
							value={form.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-control">
						<label htmlFor="password" className="label">
							<span className="label-text">Password</span>
						</label>
						<input
							id="password"
							name="password"
							type="password"
							className="input input-bordered"
							value={form.password}
							onChange={handleChange}
							required
						/>
					</div>

					<button type="submit" className="btn btn-primary w-full mt-4">
						Sign Up
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
			<Footer />
		</div>
	);
}

export default Signup;
