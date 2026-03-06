export const Chevron = ({ width = 24 }: { width?: number }) => {
	return (
		<svg
			aria-hidden="true"
			width={width}
			height={width}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g strokeWidth="0"></g>
			<g strokeLinecap="round" strokeLinejoin="round"></g>
			<g>
				<path
					d="M6 9L12 15L18 9"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				></path>
			</g>
		</svg>
	);
};
