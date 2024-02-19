import { useAuthContext } from './context/useAuthContext';
import { useSnackbar } from 'notistack';
import { PATH_AUTH } from '../../routes/paths';
import { APP_NAME, APP_VERSION } from '../../config-global';
import { Box, Link, Stack, Typography, Button } from '@mui/material';
import { NewPasswordForm } from './components';
import { Iconify } from '@zelibot/zeligate-ui';
import AuthLayout from './layout';
import TermsDialog from '../../components/termsModal';
import { useState } from 'react';
import { useRouter } from 'src/hooks/useRouter';
import { Helmet } from 'react-helmet-async';


export default function NewPasswordPage() {
	const { resetPassword } = useAuthContext();
	const { enqueueSnackbar } = useSnackbar();
	const { push } = useRouter();

	const resendCodeSubmit = () => {
		const email = sessionStorage.getItem('email-recovery');
		try {
			resetPassword(email)
				.then(() => {
					enqueueSnackbar('Code resent', { variant: 'success' });
				})
				.catch((error) => {
					const message = error?.message || error;
					enqueueSnackbar(message, { variant: 'error' });
				});
		} catch (error) {
			console.error(error);
			const message = error?.response?.data?.message || '[1] Something went wrong';
			enqueueSnackbar(message, { variant: 'error' });
		}
	};

	const redirectToLogin = () => {
		sessionStorage.removeItem('email-recovery');
		void push({
			pathname: PATH_AUTH.login,
			search: window.location.search,
		});
	};

	const [openTerms, setOpenTerms] = useState(false);

	const handleCloseTerms = () => {
		setOpenTerms(false);
	};

	return (
		<>
			<Helmet>
				<title> New Password | {APP_NAME}</title>
			</Helmet>
			<AuthLayout>
				<Box spacing={1} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<Typography variant='h4' sx={{ mb: 1 }}>
						Request sent successfully!
					</Typography>

					<Typography sx={{ color: 'text.secondary', mb: 5 }}>We&apos;ve sent a 6-digit confirmation email to your email. Please enter the code in below box to verify your email.</Typography>

					<NewPasswordForm />

					<Typography variant='body2' sx={{ my: 3 }} align={'center'}>
						Don’t have a code? &nbsp;
						<Link onClick={resendCodeSubmit} sx={{ cursor: 'pointer' }} underline='always'>
							Resend code
						</Link>
					</Typography>
					<Box sx={{ textAlign: 'center', flexGrow: 1 }}>
						<Link
							onClick={redirectToLogin}
							color='inherit'
							variant='subtitle2'
							sx={{
								mx: 'auto',
								width: '100%',
								// alignItems: 'center',
								display: 'inline-flex',
								cursor: 'pointer',
							}}
						>
							<Button fullWidth variant='outlined'>
								<Iconify icon='eva:chevron-left-fill' width={16} />
								Return to sign in
							</Button>
						</Link>
					</Box>
					{/*<Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography variant="caption" component="div" align="center">{APP_VERSION}</Typography>
                    </Box>*/}
				</Box>
				<TermsDialog open={openTerms} handleClose={handleCloseTerms} />
			</AuthLayout>
		</>
	);
}
