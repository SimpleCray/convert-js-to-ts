import { alpha, styled } from '@mui/material/styles';
import { Avatar, Box, CardContent, CardActions, Card, CardHeader, IconButton } from '@mui/material';

export const CloseButtonATS = styled(IconButton)(({ theme }) => ({
	color: theme.palette.primary,
	backgroundColor: 'white',
	'&:hover': {
		color: 'white',
		backgroundColor: '#C492F4',
	},
	position: 'absolute',
	right: '-14px',
	top: '-14px',
	boxShadow: '4px 8px 16px 0px rgba(0, 0, 0, 0.30)',
  }));

  export const CloseButton = styled(IconButton)(({ theme }) => ({
	color: theme.palette.primary,
	backgroundColor: 'white',
	'&:hover': {
		color: 'white',
		backgroundColor: '#C492F4',
	},
	position: 'absolute',
	right: '8px',
    top: '8px',
	boxShadow: '4px 8px 16px 0px rgba(0, 0, 0, 0.30)'
  }));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
	background: theme.palette.background.gradient,
	borderRadius: theme.shape.borderRadius / 2,
	color: theme.palette.common.white,
	[theme.breakpoints.down('md')]: {
		width: theme.spacing(4),
		height: theme.spacing(4),
	},
}));

export const StyledBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	color: theme.palette.grey.A700,
	flexGrow: 1,
	[theme.breakpoints.down('md')]: {
		flexWrap: 'wrap',
	},
}));

export const StyledCardActions = styled(CardActions)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(1),
	[theme.breakpoints.down('md')]: {
		button: {
			marginBottom: theme.spacing(1),
		},
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		'& .MuiButton-root': {
			width: '100%',
		},
		gap: theme.spacing(0),
	},
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(1),
	position: 'relative',
	padding: theme.spacing(4),
	'& > .body': {
		maxHeight: 600,
		// paddingBottom: 24,
		// We have to remove this overflowY to be able to see the User Feedback section
		// overflowY: 'auto',
		'&::-webkit-scrollbar': {
			width: '0.4em',
		},
		'&::-webkit-scrollbar-track': {
			boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: 'rgba(0,0,0,.1)',
			borderRadius: 10,
			visibility: 'hidden',
		},
		'&:hover': {
			'&::-webkit-scrollbar-thumb': {
				visibility: 'visible',
			},
		},
		[theme.breakpoints.down('md')]: {
			maxHeight: 300,
		},
		'&::before': {
			content: '""',
			position: 'absolute',
			bottom: 24,
			left: 0,
			right: 0,
			height: 50,
			background: `linear-gradient(${alpha(theme.palette.background.paper, 0)}, ${theme.palette.background.paper})`,
			pointerEvents: 'none',
			zIndex: 1,
		},
	},
	'& > .MuiCardContent-root:last-child': {
		paddingBottom: 0,
	},
}));

export const StyledPromptsCardContent = styled(StyledCardContent)(({ theme }) => ({
	padding: '8px 0 0',
	'& > .body': {
		paddingBottom: 0,
		maxHeight: 'unset',
		'&::before': {
			background: 'none',
		},
	},
	'&:last-child': {
		paddingBottom: 0,
	},
}));

export const StyledOutputCards = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	// flex: 1,
	gap: theme.spacing(3),
	paddingBottom: theme.spacing(4),
	alignItems: 'center',
	// backgroundColor: 'red',
	height: '100%',
	overflow: 'scroll',
	scrollBehavior: 'smooth'
}));

export const StyledTextArea = styled('TextareaAutosize')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	textarea: {
		padding: theme.spacing(1),
		borderRadius: '5px',
		color: theme.palette.common.black,
		background: theme.palette.background.default,
		border: `1px solid ${theme.palette.grey.A700}`,
		'&:hover': {
			borderColor: 'blue',
		},
		paddingBottom: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	button: {
		margin: theme.spacing(0.5),
	},
}));

// Output cards to contain prompts
export const StyledOutputPromptsCard = styled(Card)(({ theme }) => ({
	width: theme.spacing(54),
	padding: theme.spacing(4),
}));

export const StyledOutputPromptsCardHeader = styled(CardHeader)(({ theme }) => ({
	padding: `0 0 ${theme.spacing(1)}`,
	'& span': {
		fontWeight: 400,
	},
}));

// New ATS cards
export const StyledATSOutputCard = styled(Card)(({ theme }) => ({
	maxWidth: theme.spacing(84),
	width: '100%',
	padding: theme.spacing(3),
	overflow: 'visible',
}));
