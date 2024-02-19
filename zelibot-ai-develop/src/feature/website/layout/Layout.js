import PropTypes from 'prop-types';
// @mui
import { Box, styled } from '@mui/material';
import { StyledBackgroundStyles } from './LayoutStyles';
import Header from './Header';
import Footer from './Footer';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

Layout.propTypes = {
	children: PropTypes.node,
};

const Main = styled(Box)(({ theme }) => ({
	'& > :first-child': {
		[theme.breakpoints.down('md')]: {
			paddingTop: `${theme.spacing(7)} !important`,
		},
		[theme.breakpoints.up('md')]: {
			paddingTop: `${theme.spacing(10)} !important`,
		},
	},
}));

export default function Layout({ headerStyle = 'dark', headerGap = true, mobileHeaderGap = true, bgGradient = 1, offNavBar = false, noFooter = false, noMarginTopContent = false, children }) {
	return (
		<>
			<StyledBackgroundStyles bgGradient={bgGradient} />
			<Box sx={{ display: 'flex', flexDirection: 'column', height: 1, width: '100%' }}>
				<Header style={headerStyle} offNavBar={offNavBar} />
				<Box
					component='main'
					sx={{
						flexGrow: 1,
						...(headerGap ? { mt: noMarginTopContent ? 0 : { xs: 8, md: 10 } } : { mt: noMarginTopContent ? 0 : mobileHeaderGap ? { xs: 8, md: 0 } : 0 }),
					}}
				>
					{children}
				</Box>
				{noFooter ? null : <Footer />}
			</Box>
		</>
	);
}
