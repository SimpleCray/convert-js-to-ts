import PropTypes from 'prop-types';
// @mui
import { Box, Grid, Link, Stack, Typography } from '@mui/material';
// components
import { Logo } from '@zelibot/zeligate-ui';
//
import { StyledAuthLayout, StyledAuthWrapper, StyledContent, StyledHeader, StyledImageWrapper } from './AuthLayoutStyles';
import { StyledBackgroundStyles } from '../../onboarding/layout/OnboardingLayoutStyles';
import Image from '../../../components/image';
import { PATH_AUTH } from '../../../routes/paths';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import RouterLink from 'src/components/router-link';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

AuthLayout.propTypes = {
	title: PropTypes.string,
	children: PropTypes.node,
	illustration: PropTypes.string,
	path: PropTypes.string,
};

export default function AuthLayout({ children }) {
	const [location, setLocation] = useState(null);

	useEffect(() => {
		setLocation(window.location.href);
	}, []);

	return (
		<>
			<StyledBackgroundStyles />

			<StyledAuthLayout>

				<StyledHeader>
					<Link href="/"><Logo type={'full'} className={'logoFull'} sx={{ cursor: 'pointer' }} /></Link>
				</StyledHeader>

				<StyledAuthWrapper container spacing={0}>

					<Grid item xs={12} md={6} lg={4} display={'flex'} justifyContent={'center'} flexDirection={'column'}>
						<StyledContent>
							<Stack sx={{ width: 1, flexGrow: 1 }}> {children} </Stack>
						</StyledContent>
						{location && location?.includes('/auth/login') && (
							<>
								<Box>
									<Typography variant='h4' color={'common.white'} marginY={'10px'} textAlign={'center'}>
										or
									</Typography>
								</Box>
								<StyledContent>
									<Grid container display='flex' direction='column' justifyContent='center'>
										<Grid item>
											<Typography variant='h5'>Create a new account</Typography>
										</Grid>
										<Grid item>
											<Link color={'common.white'} component={RouterLink} to={{
												pathname: PATH_AUTH.register,
												search: window.location.search,
											}} sx={{ textDecoration: 'none' }}>
												<LoadingButton fullWidth color='primary' size='large' type='button' variant='contained' sx={{ marginY: '15px' }}>
													Join Zeligate
												</LoadingButton>
											</Link>
										</Grid>
									</Grid>
								</StyledContent>
							</>
						)}
					</Grid>

					<Grid item xs={12} md={5} lg={7} style={{ flexBasis: 'auto', flexGrow: 0, flexShrink: 1 }}>
						<StyledImageWrapper>
							<Image
								src='/assets/images/auth/auth-register-avatars.png'
								alt='list of avatars'
								style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
							/>
						</StyledImageWrapper>
					</Grid>

				</StyledAuthWrapper>
			</StyledAuthLayout>
		</>
	);
}
