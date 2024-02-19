import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { forwardRef } from 'react';
// @mui
import { Box, IconButton } from '@mui/material';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const IconButtonAnimate = forwardRef(({ children, size = 'medium', ...other }, ref) => (
	<AnimateWrap size={size}>
		<IconButton size={size} ref={ref} {...other}>
			{children}
		</IconButton>
	</AnimateWrap>
));

IconButtonAnimate.propTypes = {
	children: PropTypes.node,
	color: PropTypes.oneOf(['inherit', 'default', 'primary', 'secondary', 'info', 'success', 'warning', 'error']),
	size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default IconButtonAnimate;

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const varSmall = {
	hover: { scale: 1.1 },
	tap: { scale: 0.95 },
};

const varMedium = {
	hover: { scale: 1.09 },
	tap: { scale: 0.97 },
};

const varLarge = {
	hover: { scale: 1.08 },
	tap: { scale: 0.99 },
};

AnimateWrap.propTypes = {
	children: PropTypes.node,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
};

function AnimateWrap({ size, children }) {
	const isSmall = size === 'small';
	const isLarge = size === 'large';

	return (
		<Box
			component={m.div}
			whileTap='tap'
			whileHover='hover'
			variants={(isSmall && varSmall) || (isLarge && varLarge) || varMedium}
			sx={{
				display: 'inline-flex',
			}}
		>
			{children}
		</Box>
	);
}
