import PropTypes from 'prop-types';
//
import { StyledPopup } from './styles';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

MapPopup.propTypes = {
	children: PropTypes.node,
	sx: PropTypes.object,
};

export default function MapPopup({ sx, children, ...other }) {
	return (
		<StyledPopup anchor='bottom' sx={sx} {...other}>
			{children}
		</StyledPopup>
	);
}
