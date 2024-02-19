import { useEffect, useState } from 'react';
import AuthLayout from './layout';
import { Box, Link, Stack, Typography } from '@mui/material';
import { PATH_AUTH } from '../../routes/paths';
import { RegisterForm } from './components';
import { APP_NAME, APP_VERSION } from '../../config-global';
import TermsDialog from '../../components/termsModal';
import { Helmet } from 'react-helmet-async';
import RouterLink from 'src/components/router-link';
// import GoogleLogin from 'react-google-login';
// import { useGoogleOneTapLogin } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
// import { Auth } from 'aws-amplify';
// import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";

const Register = ({title}) => {
	const [openTerms, setOpenTerms] = useState(false);
	const [userType, setUserType] = useState('hr');
	const [urlParam, setUrlParams] = useState(window.location.search);

	useEffect(() => {	
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const userType = urlParams.get('userType')
		setUserType(userType)
	})

	const handleOpenTerms = () => {
		setOpenTerms(true);
	};

	const handleCloseTerms = () => {
		setOpenTerms(false);
	};

	// useEffect(() => {
	// 		useGoogleOneTapLogin({
	// 	onSuccess: credentialResponse => {
	// 	  console.log(credentialResponse);
	// 	},
	// 	onError: () => {
	// 	  console.log('Login Failed');
	// 	},
	//   });
	// }, [])

	// const GoogleSignInAction = async (response) => {
	// 	console.log('Google response >>> ', response);
	// 	if (response && response.credential) {
	// 		try {
	// 			console.log('In Try Block')
	// 			// Sign in with Cognito using the Google token
	// 			const cognitoResponse = await Auth.federatedSignIn({
	// 				provider: CognitoHostedUIIdentityProvider.GoogleLogin,
	// 				token: response.credential,
	// 			});
	// 			  console.log('Cognito Response >>> ', cognitoResponse);
	// 		} catch (error) {
	// 			console.log('Error is >>> ', error);
	// 		}
	// 	}
	// }

	return (
		<>
			<Helmet>
				<title> Register | {APP_NAME}</title>
			</Helmet>
			<AuthLayout>
				<Box spacing={1} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<Stack sx={{ mb: 3 }}>
						{userType != "Candidate" ? <Typography variant='h4' gutterBottom>
							{title ? title : 'Welcome'}
						</Typography> :
							<Typography variant='h4' gutterBottom>
								Here is your invite for a screening interview for the <Typography component={'b'} sx={{ fontSize: '28px', fontWeight: '700', color: '#9859E0' }}>Job title </Typography>at <Typography component={'b'} sx={{ fontSize: '28px', fontWeight: '700', color: '#9859E0' }}>Company</Typography>.
							</Typography>}

						{userType != "Candidate" ? <Typography variant='body1'>
							Zeligate helps talent recruitment professionals to outsource time-consuming process-related work and in doing so, free up valuable time to pursue higher level tasks. Zeligate is all about freeing up time for more 'resourceful' pursuits. We think it's about time you have
							some help.
						</Typography> : <Typography variant='body1'>
							Let's begin your journey to new opportunities by creating an account and logging into our system.
						</Typography>}
						<Typography variant='p' sx={{ my: 3, fontSize: '20px' }}>
							Create an account
						</Typography>
						<Typography variant='body1'>
							Already have an account?
							<Link component={RouterLink} to={{
								pathname: PATH_AUTH.login,
								search: urlParam,
							}} variant='body1' sx={{ marginX: '10px', textDecoration: 'underline' }}>
								Log in
							</Link>
						</Typography>
						{/* <GoogleLogin
							clientId="425849844901-a9f48o1cpt3qh7quk6cba3scr8dihjhc.apps.googleusercontent.com"
							buttonText="Login"
							onSuccess={responseGoogle}
							onFailure={responseGoogle}
							cookiePolicy={'single_host_origin'}
							render={renderProps => (
								<Stack onClick={renderProps.onClick} flexDirection={'row'} gap={2} my={4} py={1} justifyContent={'center'} alignItems={'center'} sx={{ width: '100%', border: '1px solid purple', borderRadius: '32px', cursor: 'pointer' }}>
									<img src="/assets/images/google-logo.svg"></img>
									<Typography variant={'p'}>Continue with Google</Typography>
								</Stack>
							)}
						/> */}
						{/* <GoogleLogin
							onSuccess={credentialResponse => GoogleSignInAction(credentialResponse)}
							onError={() => {
								console.log('Google Login Failed');
							}}
						/> */}
						{/* <button onClick={() => GoogleSignInAction()}>Sign in with Google</button> */}
					</Stack>

					<RegisterForm />

					<Box sx={{ flexGrow: 1, textAlign: 'center' }}>
						<Typography component='div' color={'text.secondary'} textAlign={'center'} variant={'body2'} mt={2}>
							{'By signing up, I agree to the '}
							<Link underline='always' onClick={handleOpenTerms} sx={{ cursor: 'pointer' }}>
								Terms and Conditions
							</Link>
						</Typography>
					</Box>

					{/* Temporarily commented out for Beta release */}
					{/*<Box>*/}
					{/*  <Typography variant="caption" component="div" align="center" mt={5} textAlign={'center'}>{APP_VERSION}</Typography>*/}
					{/*</Box>*/}
				</Box>
				{/*<PrivacyDialog open={openPrivacy} handleClose={handleClosePrivacy}/>*/}
				<TermsDialog open={openTerms} handleClose={handleCloseTerms} />
			</AuthLayout>
		</>
	);
}

export default Register;