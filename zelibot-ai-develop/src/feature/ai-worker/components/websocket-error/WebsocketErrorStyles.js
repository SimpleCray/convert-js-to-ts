import { Box, styled } from '@mui/material';

export const StyledWebsocketDialogWrapper = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '100%',
	maxWidth: 450,
	outline: 0,
	'& .MuiSvgIcon-root': {
		fontSize: 132,
		color: theme.palette.grey[500],
	},
	'& .MuiCardContent-root': {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(4),
	},
}));

export const StyledContent = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: theme.spacing(4),
	paddingTop: theme.spacing(4),
	paddingBottom: theme.spacing(4),
	textAlign: 'center',
}));
