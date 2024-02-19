import { styled } from '@mui/material/styles';
import { Box, GlobalStyles as MUIGlobalStyles, Grid } from '@mui/material';

export function StyledBackgroundStyles() {
	return (
		<MUIGlobalStyles
			styles={{
				body: {
					backgroundImage: 'url(/assets/images/background-gradient.jpg)',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundAttachment: 'fixed',
					backgroundPosition: 'center',
				},
			}}
		/>
	);
}

export const StyledOnboarding = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(3),
	padding: theme.spacing(6),
	maxWidth: 1400,
	margin: 'auto',
	[theme.breakpoints.down('lg')]: {
		padding: theme.spacing(2),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
	},
}));

export const StyledHeader = styled(Box)(({ theme }) => ({
	'& .logoFull': {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'& svg': {
			[theme.breakpoints.up('md')]: {
				maxHeight: 56,
			},
			'& path': {
				fill: theme.palette.common.white,
			},
		},
	},
}));

export const StyledWorkerDetailsWrapper = styled(Grid)(({ theme }) => ({
	flexGrow: 1,
	[theme.breakpoints.up('md')]: {
		minHeight: 700,
	},
}));
