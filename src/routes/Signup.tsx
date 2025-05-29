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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value, });
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const res = await API.signup(form);
		if ("error" in res) {
			console.log(res.error);
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
				</fieldset>
			</form>
			<Footer />
		</div>
	);
}

export default Signup;
