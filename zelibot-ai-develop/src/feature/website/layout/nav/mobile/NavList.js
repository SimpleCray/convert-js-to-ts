import PropTypes from 'prop-types';
import { useState } from 'react';
import { usePathname } from 'src/hooks/usePathname';
// @mui
import { Collapse } from '@mui/material';
// components
import { NavSectionVertical } from '../../../../../components/nav-section';
//
import NavItem from './NavItem';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavList.propTypes = {
	item: PropTypes.object,
};

export default function NavList({ item }) {
	const pathname = usePathname();

	const { path, children } = item;

	const externalLink = path.includes('http');

	const [open, setOpen] = useState(false);

	return (
		<>
			<NavItem item={item} open={open} onClick={() => setOpen(!open)} active={pathname === path} isExternalLink={externalLink} />

			{!!children && (
				<Collapse in={open} unmountOnExit>
					<NavSectionVertical
						data={children}
						sx={{
							'& .MuiList-root:last-of-type .MuiListItemButton-root': {
								height: 160,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								bgcolor: 'background.neutral',
								backgroundRepeat: 'no-repeat',
								backgroundImage: 'url(/assets/illustrations/illustration_dashboard.png)',
								'& > *:not(.MuiTouchRipple-root)': { display: 'none' },
							},
						}}
					/>
				</Collapse>
			)}
		</>
	);
}
