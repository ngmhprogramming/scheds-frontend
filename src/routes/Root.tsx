import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useEffect } from 'react';

const Root = () => {
	const location = useLocation();

	const [success, setSuccess] = useState<string | null>(null);

	useEffect(() => {
		if (location.state && (location.state as any).success) {
			setSuccess((location.state).success);
			window.history.replaceState({}, document.title);
		}
	}, [location.state])

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
			<div className="hero bg-base-200 flex-grow min-h-[75vh]">
				<div className="hero-content flex flex-col items-center text-center w-full max-w-6xl mx-auto px-4 py-8">
					<div className="max-w-md">
						<h1 className="text-5xl font-bold">Scheds</h1>
						<p className="py-6">Your scheduling companion.</p>
						<Link to="/signup">
							<button className="btn btn-primary">Get Started</button>
						</Link>
					</div>

					<div className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
						<div className="card bg-base-100 shadow-xl p-6">
							<div className="text-4xl mb-3">⏰</div>
							<h3 className="font-bold text-lg">Smart Reminders</h3>
							<p>Never miss an appointment again.</p>
						</div>
						<div className="card bg-base-100 shadow-xl p-6">
							<div className="text-4xl mb-3">🤝</div>
							<h3 className="font-bold text-lg">Collaborate Easily</h3>
							<p>Coordinate with friends, family, or coworkers.</p>
						</div>
						<div className="card bg-base-100 shadow-xl p-6">
							<div className="text-4xl mb-3">🌐</div>
							<h3 className="font-bold text-lg">Cross-Platform Sync</h3>
							<p>Access your schedule anywhere, anytime.</p>
						</div>
						<div className="card bg-base-100 shadow-xl p-6">
							<div className="text-4xl mb-3">🔔</div>
							<h3 className="font-bold text-lg">Custom Notifications</h3>
							<p>Personalize alerts so they work for you.</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

export default Root;
