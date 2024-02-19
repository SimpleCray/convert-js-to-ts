import { alpha, styled } from '@mui/material/styles';

export const StyledRoot = styled('div')(({ theme }) => ({
	right: 0,
	bottom: 0,
	zIndex: 9998,
	width: '100%',
	height: '100%',
	position: 'fixed',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: theme.palette.background.default,
}));

export const StyledLoading = styled('div')(({ theme }) => ({
	right: 0,
	bottom: 0,
	zIndex: 9998,
	width: '100%',
	height: '100%',
	position: 'absolute',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: alpha(theme.palette.background.default, 0.5),
}));
