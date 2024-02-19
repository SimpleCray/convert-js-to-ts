import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Button } from '@mui/material';

export const StyledSkillsTextWrapper = styled(Box)(({ theme }) => ({
	width: '100%',
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
}));

export const StyledWorkerDetails = styled(Card)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	height: '100%',
	alignItems: 'center',
	padding: theme.spacing(4),
	gap: theme.spacing(4),
	borderRadius: Number(theme.shape.borderRadius) * 2,
	[theme.breakpoints.down('md')]: {
		gap: theme.spacing(2),
		padding: theme.spacing(2),
	},
}));

export const StyledMessageDialog = styled('div')(({ theme }) => ({
	position: 'relative',
	backgroundColor: theme.palette.background.paper,
	width: '100%',
	padding: theme.spacing(2),
	marginTop: theme.spacing(4),
	borderRadius: Number(theme.shape.borderRadius) * 2,
	boxShadow: `0px 0 1px ${alpha(theme.palette.common.black, 0.25)}`,
	// add triangle to the top center of the dialog
	'&::before': {
		content: '""',
		position: 'absolute',
		top: -15,
		left: 'calc(77% - 16px)',
		width: 32,
		height: 16,
		backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='15' viewBox='0 0 32 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.1716 1.17169L0 14.3433H32L18.8284 1.17169C17.2663 -0.390408 14.7337 -0.390411 13.1716 1.17169Z' fill='white' fill-opacity='1'/%3E%3C/svg%3E%0A")`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		transition: 'left 0.3s ease-in-out',
		filter: 'drop-shadow(0px -1px 1px rgba(0, 0, 0, 0.15))',
		zIndex: 1,
	},
	[theme.breakpoints.down('lg')]: {
		'&::before': {
			left: 'calc(72% - 16px)',
		},
	},
	[theme.breakpoints.down('md')]: {
		'&::before': {
			left: 'calc(50% - 16px)',
		},
	},
}));

export const NextButton = ({ text, onClick }) => (
	<Button
		sx={{ backgroundColor: '#21044c', color: 'white', alignSelf: 'flex-end' }}
		variant='contained' size='large' onClick={onClick}>
		Continue
	</Button>
);
