import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// next
import { Link as NextLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
	const theme = useTheme();

	// -------------------------------------------------------
	const logo = <Box component='img' src='/logo/logo_single.svg' sx={{ width: 40, height: 40, cursor: !disabledLink ? 'pointer' : 'initial', ...sx }} />;

	if (disabledLink) {
		return logo;
	}

	return (
		<Link component={NextLink} href='/' sx={{ display: 'contents' }}>
			{logo}
		</Link>
	);
});

Logo.propTypes = {
	sx: PropTypes.object,
	disabledLink: PropTypes.bool,
};

export default Logo;
