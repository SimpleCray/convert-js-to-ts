// @mui
import { Stack, Button, Typography, Box } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/context/useAuthContext';
// locales
import { useLocales } from '../../../../locales';
// routes
import { APP_SUPPORT_EMAIL } from '../../../../config-global';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { Logo } from '@zelibot/zeligate-ui';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function NavDocs() {
	const { user } = useAuthContext();
	const { push } = useRouter();
	const { translate } = useLocales();

	const handleSupport = () => {
		// window.open(`mailto:${APP_SUPPORT_EMAIL}`, '_blank');
		void push(PATH_DASHBOARD.billing.upgrade);
	};

	return (
		<Stack
			spacing={3}
			sx={{
				px: 5,
				pb: 5,
				mt: 10,
				width: 1,
				display: 'block',
				textAlign: 'center',
			}}
		>
			<Logo type={'full'} sx={{ maxHeight: 'initial' }} />

			<div>
				<Typography gutterBottom variant='subtitle1'>
					{`${translate('docs.hi')}, ${user?.displayName ?? ''}`}
				</Typography>

				<Typography variant='body2' sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
					{`${translate('docs.description')}`}
				</Typography>
			</div>

			<Button target='_blank' rel='noopener' variant='contained' onClick={handleSupport}>
				{`${translate('docs.documentation')}`}
			</Button>
		</Stack>
	);
}
