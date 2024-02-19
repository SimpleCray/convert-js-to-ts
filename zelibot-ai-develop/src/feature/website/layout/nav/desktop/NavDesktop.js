import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
//
import NavList from './NavList';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavDesktop.propTypes = {
	data: PropTypes.array,
	isOffset: PropTypes.bool,
};

export default function NavDesktop({ isOffset, data, style, ...props }) {
	return (
		<Stack spacing={4} component="nav" direction="row" alignItems="center" justifyContent="center" {...props}>
			{data.map((link) => (
				<NavList key={link.title} item={link} isOffset={isOffset} style={style} />
			))}
		</Stack>
	);
}
