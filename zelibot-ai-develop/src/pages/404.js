import PropTypes from 'prop-types';
// @mui
import { Stack, Container, Toolbar, Link, AppBar, Box, Typography, Button, useTheme } from '@mui/material';
// hooks
import useOffSetTop from '../hooks/useOffSetTop';
// config
import { APP_NAME, HEADER } from '../config-global';
//
import { bgBlur } from '../utils/cssStyles';
import { Logo } from '@zelibot/zeligate-ui';
import RouterLink from '../components/router-link';
import { PATH_PAGE } from '../routes/paths';
import { Helmet } from 'react-helmet-async';
import { MotionContainer, varBounce } from '../components/animate';
import { m } from 'framer-motion';
import { PageNotFoundIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function NotFound() {
	const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);
	const theme = useTheme();

	return (
		<>
			<AppBar color='transparent' sx={{ boxShadow: 0 }}>
				<Toolbar
					sx={{
						justifyContent: 'space-between',
						height: {
							xs: HEADER.H_MOBILE,
							md: HEADER.H_MAIN_DESKTOP,
						},
						transition: theme.transitions.create(['height', 'background-color'], {
							easing: theme.transitions.easing.easeInOut,
							duration: theme.transitions.duration.shorter,
						}),
						...(isOffset && {
							...bgBlur({ color: theme.palette.background.default }),
							height: {
								md: HEADER.H_MAIN_DESKTOP - 16,
							},
						}),
					}}
				>
					<Logo type={'full'} />

					<Link component={RouterLink} href={PATH_PAGE.faqs} variant='subtitle2' color='inherit'>
						Need Help?
					</Link>
				</Toolbar>

				{isOffset && <Shadow />}
			</AppBar>

			<Container component='main'>
				<Stack
					sx={{
						py: 12,
						m: 'auto',
						maxWidth: 400,
						minHeight: '100vh',
						textAlign: 'center',
						justifyContent: 'center',
					}}
				>
					<Helmet>
						<title> 404 Page Not Found | {APP_NAME}</title>
					</Helmet>

					<MotionContainer>
						<m.div variants={varBounce().in}>
							<Typography variant='h3' paragraph>
								Sorry, page not found!
							</Typography>
						</m.div>

						<m.div variants={varBounce().in}>
							<Typography sx={{ color: 'text.secondary' }}>Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.</Typography>
						</m.div>

						<m.div variants={varBounce().in}>
							<PageNotFoundIllustration
								sx={{
									height: 260,
									my: { xs: 5, sm: 10 },
								}}
							/>
						</m.div>

						<Button component={RouterLink} href='/' size='large' variant='contained'>
							Go to Home
						</Button>
					</MotionContainer>
				</Stack>
			</Container>
		</>
	);
}

Shadow.propTypes = {
	sx: PropTypes.object,
};

function Shadow({ sx, ...other }) {
	return (
		<Box
			sx={{
				left: 0,
				right: 0,
				bottom: 0,
				height: 24,
				zIndex: -1,
				m: 'auto',
				borderRadius: '50%',
				position: 'absolute',
				width: `calc(100% - 48px)`,
				boxShadow: (theme) => theme.customShadows.z8,
				...sx,
			}}
			{...other}
		/>
	);
}
