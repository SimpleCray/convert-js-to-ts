export const makeReadable = (value) => {
	return value
		?.split('_')
		?.map((v) => v?.charAt(0)?.toUpperCase() + v.substr(1).toLowerCase())
		.join(' ');
};
