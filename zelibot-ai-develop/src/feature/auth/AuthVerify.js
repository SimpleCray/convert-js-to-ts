import { useAuthContext } from './context/useAuthContext';
import { useSnackbar } from 'notistack';
import { useSelector } from '../../redux/store';
import { APP_NAME, APP_VERSION } from '../../config-global';
import { Box, Link, Typography, Button } from '@mui/material';
import { VerifyForm } from './components';
import { PATH_AUTH } from '../../routes/paths';
import { Iconify } from '@zelibot/zeligate-ui';
import AuthLayout from './layout';
import { Helmet } from 'react-helmet-async';
import RouterLink from 'src/components/router-link';

import { useState, useEffect } from 'react';
import { useRouter } from "../../hooks/useRouter";


export default function VerifyCodePage() {
	const { resendCode, isAuthenticated, requestedLocation } = useAuthContext();
	const { enqueueSnackbar } = useSnackbar();
	const { userState } = useSelector((state) => state.auth);
	const [userType, setUserType] = useState('hr');
	const { push } = useRouter();

	const resendCodeSubmit = () => {
		try {
			resendCode(userState?.email)
				.then(() => {
					enqueueSnackbar('Code resent', { variant: 'success' });
				})
				.catch((error) => {
					const message = error?.message || error;
					enqueueSnackbar(message, { variant: 'error' });
				});
		} catch (error) {
			console.error(error);
			const message = error?.response?.data?.message || '[2] Something went wrong';
			enqueueSnackbar(message, { variant: 'error' });
		}
	};


	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const userType = urlParams.get('userType')
		setUserType(userType)
	});

	useEffect(() => {
		if (isAuthenticated) {
			push(requestedLocation + window.location.search);
		}
	}, [requestedLocation, isAuthenticated]);

	return (
		<>
			<Helmet>
				<title> Verify Code | {APP_NAME}</title>
			</Helmet>
			<AuthLayout>
				<Box spacing={1} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

					{userType === 'Candidate' && <><Typography variant='h4' paragraph>
						<b>Here is your invite for a screening interview for the <Typography component={'b'} sx={{ fontSize: '28px', fontWeight: '700', color: '#9859E0' }}>Job title </Typography>at <Typography component={'b'} sx={{ fontSize: '28px', fontWeight: '700', color: '#9859E0' }}>Company</Typography>.</b>
					</Typography>
						<Typography variant='body1'>
							Let's begin your journey to new opportunities by creating an account and logging into our system.
						</Typography>

						<br />
						<br />
					</>}




					<Typography variant='h4' paragraph sx={{ mb: 1 }}>
						<>Enter verification code</>
					</Typography>

					<Typography sx={{ color: 'text.secondary', mb: 5 }}>We sent a verification code to your email address.</Typography>

					<VerifyForm />

					<Typography variant='body2' sx={{ my: 3 }} align={'center'}>
						Don’t have a code? &nbsp;
						<Link onClick={resendCodeSubmit} sx={{ cursor: 'pointer' }} underline='always'>
							Resend code
						</Link>
					</Typography>

					<Box sx={{ textAlign: 'center', flexGrow: 1 }}>
						<Link
							component={RouterLink}
							to={{
								pathname: PATH_AUTH.login,
								search: window.location.search,
							}}
							color='inherit'
							variant='subtitle2'
							sx={{
								mx: 'auto',
								width: '100%',
								// alignItems: 'center',
								display: 'inline-flex',
							}}
						>
							<Button fullWidth variant='outlined'>
								<Iconify icon='eva:chevron-left-fill' width={16} />
								Return to sign in
							</Button>
						</Link>
					</Box>
					{/*<Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="caption" component="div" align="center">{APP_VERSION}</Typography>
                    </Box>*/}
				</Box>
			</AuthLayout>
		</>
	);
}
