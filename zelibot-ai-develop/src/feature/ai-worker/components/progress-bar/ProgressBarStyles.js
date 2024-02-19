import { styled } from '@mui/material/styles';

export const StyledProgressBar = styled('div')(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(2),
}));

export const StyledProgressText = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
}));

export const StyledMeta = styled('div')(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(1),
	alignItems: 'center',
	fontSize: 12,
}));

export const StyledProgressButton = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
}));
