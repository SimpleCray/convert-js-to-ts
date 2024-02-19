import { styled } from '@mui/material/styles';

export const StyledPromptWrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	overflowX: 'auto',
}));

export const StyledPromptScroller = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	[theme.breakpoints.down('md')]: {
		flexDirection: 'row',
		flex: 'none',
	},
}));
