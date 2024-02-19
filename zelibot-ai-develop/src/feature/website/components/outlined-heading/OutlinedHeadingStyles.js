import { styled } from '@mui/material/styles';

export const StyledOutlinedHeading = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	maxWidth: 972,
	margin: 'auto',
	gap: theme.spacing(4),
	[theme.breakpoints.up('md')]: {
		gap: theme.spacing(4.5),
	},
}));
