import { APP_NAME, APP_VERSION } from '../../config-global';
import { Box, Link, Stack, Typography, Button } from '@mui/material';
import { ResetPasswordForm } from './components';
import { PATH_AUTH } from '../../routes/paths';
import { Iconify } from '@zelibot/zeligate-ui';
import AuthLayout from './layout';
import TermsDialog from '../../components/termsModal';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import RouterLink from 'src/components/router-link';

export default function ResetPasswordPage() {
	const [openTerms, setOpenTerms] = useState(false);

	const handleOpenTerms = () => {
		setOpenTerms(true);
	};

	const handleCloseTerms = () => {
		setOpenTerms(false);
	};

	return (
		<>
			<Helmet>
				<title> Reset Password | {APP_NAME}</title>
			</Helmet>
			<AuthLayout>
				<Box spacing={1} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<Typography variant='h4' sx={{ mb: 1 }}>
						Forgot your password?
					</Typography>

					<Typography sx={{ color: 'text.secondary', mb: 5 }}>Please enter the email address associated with your account, if you have an account you will receive a link to reset your password.</Typography>

					<ResetPasswordForm />

					<Box sx={{ flexGrow: 1, mt: 3, textAlign: 'center' }}>
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
					{/*<Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography variant="caption" component="div" align="center">{APP_VERSION}</Typography>
                    </Box>*/}
					{/*<Stack direction="row" spacing={2} justifyContent="center">
                        <Typography variant={"body2"}>
                            <Link underline="always" onClick={handleOpenTerms} sx={{cursor:'pointer'}}>
                                Terms of Service
                            </Link>
                        </Typography>
                        <Typography variant={"body2"}>
                            <Link underline="always" onClick={handleOpenPrivacy} sx={{cursor:'pointer'}}>
                                Privacy Policy
                            </Link>
                        </Typography>
                    </Stack>*/}
				</Box>
				<TermsDialog open={openTerms} handleClose={handleCloseTerms} />
			</AuthLayout>
		</>
	);
}
