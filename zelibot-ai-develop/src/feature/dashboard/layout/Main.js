import PropTypes from 'prop-types';
// @mui
import { Box, Link, Typography } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// config
import { HEADER, NAV } from '../../../config-global';
// components
import { useSettingsContext } from '@zelibot/zeligate-ui';
import { APP_NAME } from '../../../config-global';
import { PATH_PAGE } from '../../../routes/paths';
import { TERMS_PAGE } from '../../../constants';
import RouterLink from 'src/components/router-link';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const SPACING = 8;

Main.propTypes = {
	sx: PropTypes.object,
	children: PropTypes.node,
};

export default function Main({ children, sx, ...other }) {
	const { themeLayout } = useSettingsContext();

	const isNavMini = themeLayout === 'mini';

	const isDesktop = useResponsive('up', 'lg');

	return (
		<Box
			component='main'
			sx={{
				position: 'relative',
				flexGrow: 1,
				py: `${HEADER.H_MOBILE + SPACING}px`,
				...(isDesktop && {
					px: 2,
					py: `${HEADER.H_DASHBOARD_DESKTOP + SPACING}px`,
					width: `calc(100% - ${NAV.W_DASHBOARD}px)`,
					...(isNavMini && {
						width: `calc(100% - ${NAV.W_DASHBOARD_MINI}px)`,
					}),
				}),
				...sx,
			}}
			{...other}
		>
			{children}

			<Box
				sx={{
					position: 'absolute',
					width: '100%',
					left: 0,
					bottom: 0,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 3,
				}}
			>
				<Typography variant='caption' component='div' align='center'>
					© {new Date().getFullYear()} {APP_NAME}. All rights reserved.{' '}
					<Link component={RouterLink} href={PATH_PAGE.terms}>
						{TERMS_PAGE.title}
					</Link>
					.
				</Typography>
			</Box>
		</Box>
	);
}
