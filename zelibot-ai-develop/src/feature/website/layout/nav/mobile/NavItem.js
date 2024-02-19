import PropTypes from 'prop-types';

import RouterLink from '../../../../../components/router-link';
// @mui
import { Link, ListItemText, ListItemIcon } from '@mui/material';
// components
import { Iconify } from '@zelibot/zeligate-ui';
//
import { ListItem } from './styles';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavItem.propTypes = {
	open: PropTypes.bool,
	active: PropTypes.bool,
	item: PropTypes.object,
	isExternalLink: PropTypes.any,
};

export default function NavItem({ item, open, active, isExternalLink, ...other }) {
	const { title, path, icon, children } = item;

	const renderContent = (
		<ListItem active={active} {...other}>
			<ListItemIcon> {icon} </ListItemIcon>

			<ListItemText disableTypography primary={title} />

			{!!children && <Iconify width={16} icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} sx={{ ml: 1 }} />}
		</ListItem>
	);

	// ExternalLink
	if (isExternalLink) {
		return (
			<Link href={path} target='_blank' rel='noopener' underline='none'>
				{renderContent}
			</Link>
		);
	}

	// Has child
	if (children) {
		return renderContent;
	}

	// Default
	return (
		<Link component={RouterLink} href={path} underline='none'>
			{renderContent}
		</Link>
	);
}
