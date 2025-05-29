import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="px-4 py-6 max-w-6xl mx-auto">
			{children}
		</main>
	);
};

export default Container;
