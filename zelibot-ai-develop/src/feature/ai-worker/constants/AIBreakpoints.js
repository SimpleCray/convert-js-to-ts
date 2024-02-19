const customBreakpoints = {
	values: {
		xs: 0,
		sm: 600,
		md: 1180,
		lg: 1440,
		xl: 1920,
	},
};

export default function AIBreakpointWidth(width = 'md') {
	return customBreakpoints['values'][width];
}
