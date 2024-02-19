import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { Stack, Fade, Portal } from '@mui/material';
// hooks
import useActiveLink from '../../../../../hooks/useActiveLink';
//
import { NavItem, NavItemDashboard } from './NavItem';
import { StyledSubheader, StyledMenu } from './styles';
import { usePathname } from 'src/hooks/usePathname';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavList.propTypes = {
	item: PropTypes.object,
	isOffset: PropTypes.bool,
};

export default function NavList({ item, isOffset, style }) {
	const pathname = usePathname();

	const [openMenu, setOpenMenu] = useState(false);

	const { path, children } = item;

	const active = useActiveLink(path, false);

	const externalLink = path.includes('http');

	useEffect(() => {
		if (openMenu) {
			handleCloseMenu();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleOpenMenu = () => {
		if (children) {
			setOpenMenu(true);
		}
	};

	const handleCloseMenu = () => {
		setOpenMenu(false);
	};

	return (
		<div style={{ borderBottom: active ? '2px solid white' : null}}>
			<NavItem item={item} isOffset={isOffset} active={active} open={openMenu} isExternalLink={externalLink} onMouseEnter={handleOpenMenu} onMouseLeave={handleCloseMenu} style={style} />

			{!!children && openMenu && (
				<Portal>
					<Fade in={openMenu}>
						<StyledMenu onMouseEnter={handleOpenMenu} onMouseLeave={handleCloseMenu}>
							{children.map((list) => (
								<NavSubList key={list.subheader} subheader={list.subheader} items={list.items} isDashboard={list.subheader === 'Dashboard'} onClose={handleCloseMenu} />
							))}
						</StyledMenu>
					</Fade>
				</Portal>
			)}
		</div>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavSubList.propTypes = {
	items: PropTypes.array,
	onClose: PropTypes.func,
	isDashboard: PropTypes.bool,
	subheader: PropTypes.string,
};

function NavSubList({ items, isDashboard, subheader, onClose }) {
	const pathname = usePathname();

	const isActive = (path) => pathname === path;

	return (
		<Stack spacing={2.5} gridColumn={isDashboard ? 'span 6' : 'span 2'} alignItems='flex-start'>
			<StyledSubheader disableSticky>{subheader}</StyledSubheader>

			{items.map((item) => (isDashboard ? <NavItemDashboard key={item.title} item={item} onClick={onClose} /> : <NavItem subItem key={item.title} item={item} active={isActive(item.path)} onClick={onClose} />))}
		</Stack>
	);
}
