import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Root = () => {
	return (
		<>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow px-4 py-6 max-w-6xl mx-auto">
					<h1 className="text-3xl">Root</h1>
				</main>
				<Footer />
			</div>
		</>
	);
}

export default Root;