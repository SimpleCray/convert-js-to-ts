// @mui
import { Divider, IconButton, Stack } from '@mui/material';
// auth
import { useAuthContext } from '../../context/useAuthContext';
// components
import { Iconify } from '@zelibot/zeligate-ui';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function AuthSocial() {
	const { loginWithGoogle } = useAuthContext();

	const handleGoogleLogin = async () => {
		try {
			if (loginWithGoogle) {
				loginWithGoogle();
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<Divider
				sx={{
					my: 2.5,
					typography: 'overline',
					color: 'text.disabled',
					'&::before, ::after': {
						borderTopStyle: 'dashed',
					},
				}}
			>
				OR
			</Divider>

			<Stack direction='row' justifyContent='center' spacing={2}>
				<IconButton onClick={handleGoogleLogin}>
					<Iconify icon='eva:google-fill' color='#DF3E30' />
				</IconButton>
			</Stack>
		</div>
	);
}
