import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useEffect } from 'react';

const Root = () => {
	useEffect(() => {
		const username = localStorage.getItem("username");
		console.log("Username", username);
	});

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
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
