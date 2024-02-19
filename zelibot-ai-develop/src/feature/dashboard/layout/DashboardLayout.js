import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// auth
import AuthGuard from '../../auth/context/AuthGuard';
// components
import { useSettingsContext } from '@zelibot/zeligate-ui';
//
import Main from './Main';
import Header from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
import { StyledBackgroundStyles } from './DashboardLayoutStyles';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

DashboardLayout.propTypes = {
	children: PropTypes.node,
};

export default function DashboardLayout({ children }) {
	const { themeLayout } = useSettingsContext();

	const isDesktop = useResponsive('up', 'lg');

	const [open, setOpen] = useState(false);

	const isNavMini = themeLayout === 'mini';

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} />;

	const renderContent = () => {
		if (isNavMini) {
			return (
				<>
					<StyledBackgroundStyles />
					<Header onOpenNav={handleOpen} />

					<Box
						sx={{
							display: { lg: 'flex' },
							minHeight: { lg: 1 },
						}}
					>
						{isDesktop ? <NavMini /> : renderNavVertical}

						<Main>{children}</Main>
					</Box>
				</>
			);
		}

		return (
			<>
				<StyledBackgroundStyles />
				<Header onOpenNav={handleOpen} />

				<Box
					sx={{
						display: { lg: 'flex' },
						minHeight: { lg: 1 },
					}}
				>
					{renderNavVertical}

					<Main>{children}</Main>
				</Box>
			</>
		);
	};

	return <AuthGuard> {renderContent()} </AuthGuard>;
}
