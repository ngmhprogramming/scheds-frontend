const Footer = () => {
	return (
		<footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
			<div>
				<p>© {new Date().getFullYear()} Scheds. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;