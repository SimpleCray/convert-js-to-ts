import AuthLayout from './layout';
import { Box, Link, Stack, Typography } from '@mui/material';
import { LoginForm } from './components';
import { APP_NAME, APP_VERSION } from '../../config-global';
import { useState } from 'react';
import TermsDialog from '../../components/termsModal';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { AIGetAPIRequest } from '../ai-worker/constants';
import { useAuthContext } from './context/useAuthContext';
import { SplashScreen } from '../../components/loading-screen';
import { enqueueSnackbar } from 'notistack';

export default function Login() {
	const [openTerms, setOpenTerms] = useState(false);
	const [userType, setUserType] = useState('hr');
	const [loading, setLoading] = useState(true);
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const { login } = useAuthContext();

	useEffect(() => {
		const inviteToken = urlParams.get('inviteToken');
		if (inviteToken) {
			// Attempt to login here with candidate email and password. On success, set prescreening redirect to true
			getCandidateDetailsFromInviteToken(inviteToken);
			// console.log('Should directly redirect to prescreening interview here.')
		} else {
			setLoading(false)
		}
		const userType = urlParams.get('userType')
		setUserType(userType)
	}, [])

	const getCandidateDetailsFromInviteToken = (inviteToken) => {
		const endpointUrl = `${process.env.API_VIDEO_CHAT}/get_token_details?inviteToken=${inviteToken}`;
		AIGetAPIRequest(endpointUrl)
			.then((response) => {
				const { candidate_email, pk } = response[0];
				window.sessionStorage.setItem('candidate_details', JSON.stringify(response[0]))
				login(candidate_email, pk, '/dashboard/choose-helper')
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching candidate details. Please try again later', { variant: 'error' });
			});
	}

	const handleOpenTerms = () => {
		setOpenTerms(true);
	};

	const handleCloseTerms = () => {
		setOpenTerms(false);
	};

	return loading ? <SplashScreen /> : (
		<>
			<Helmet>
				<title> Login | {APP_NAME}</title>
			</Helmet>
			<AuthLayout>
				<Box spacing={1} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<Stack spacing={1} sx={{ mb: 3, position: 'relative' }}>
						{userType === 'Candidate' ? <Typography variant='h5'>Log into Zeligate</Typography> : <Typography variant='h5'>Let's start our adventure together</Typography>}
						{/*<Stack direction="row" spacing={0.5}>*/}
						{/*    <Typography variant="body1">New user?</Typography>*/}
						{/*    <Link component={NextLink} href={PATH_AUTH.register} underline="always">*/}
						{/*        Create an account*/}
						{/*    </Link>*/}
						{/*</Stack>*/}
					</Stack>

					<Box sx={{ flexGrow: 1 }}>
						<LoginForm />
					</Box>
					{/* Temporarily removed for Beta release */}
					{/*<Box mb={2}>*/}
					{/*    <Typography variant="caption" textAlign={'center'} component="div" align="center">{APP_VERSION}</Typography>*/}
					{/*</Box>*/}
					<Stack direction='row' spacing={2} justifyContent='center'>
						<Typography variant={'body2'}>
							<Link underline='always' onClick={handleOpenTerms} sx={{ cursor: 'pointer' }}>
								Terms and Conditions
							</Link>
						</Typography>
					</Stack>
				</Box>
				<TermsDialog open={openTerms} handleClose={handleCloseTerms} />
			</AuthLayout>
		</>
	);
}
