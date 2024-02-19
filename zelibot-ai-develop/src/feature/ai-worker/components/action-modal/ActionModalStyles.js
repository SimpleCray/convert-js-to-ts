import { Box, styled, Modal } from '@mui/material';

export const StyledModal = styled(Modal)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	' & .MuiModal-backdrop' : {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	width: '100%',
}));

export const CustomModalWrapper = styled(Box)(({ theme }) => ({
	height: '100%',
	'& > div': {
		position: 'relative',
		top: '50%',
		flex: 1,
		display: 'flex',
		// maxWidth: 650,
		// maxWidth: theme.spacing('md'),
		transform: 'translateY(-50%)',
		maxHeight: 'fit-content',
		// height: '100%',
	},
}));

export const StyledModalWrapper = styled(Box)(({ theme }) => ({
	height: '100%',
	'& > div': {
		position: 'relative',
		top: '50%',
		flex: 1,
		display: 'flex',
		// maxWidth: 650,
		// maxWidth: theme.spacing('md'),
		transform: 'translateY(-50%)',
		maxHeight: '80%',
		height: '100%',
	},
}));

export const StyledModalInner = styled(Box)(({ theme }) => ({
	position: 'relative',
	top: '50%',
	flex: 1,
	display: 'flex',
	// maxWidth: 650,
	width: '100%',
	transform: 'translateY(-50%)',
	maxHeight: '100%',
	'& .MuiCard-root': {
		display: 'flex',
		'& > *': {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
		},
	},
	'& .MuiCardContent-root': {
		display: 'flex',
		flexDirection: 'column',
		overflowY: 'auto',
		gap: theme.spacing(2),
		'& .quill': {
			height: `calc(100% - ${theme.spacing(8)})`,
		},
	},
	'& .MuiCardActions-root': {
		justifyContent: 'flex-end',
		paddingTop: theme.spacing(2),
	},
}));

export const CustomInnerModal = styled(Box)(({ theme }) => ({
	position: 'relative',
	top: '50%',
	flex: 1,
	display: 'flex',
	// maxWidth: 650,
	width: '100%',
	transform: 'translateY(-50%)',
	height: 'fit-content',
	// maxHeight: '50%',
	'& .MuiCard-root': {
		display: 'flex',
		'& > *': {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
		},
	},
	'& .MuiCardContent-root': {
		display: 'flex',
		flexDirection: 'column',
		overflowY: 'auto',
		gap: theme.spacing(2),
		'& .quill': {
			height: `calc(100% - ${theme.spacing(8)})`,
		},
	},
	'& .MuiCardActions-root': {
		justifyContent: 'flex-end',
		paddingTop: theme.spacing(2),
	},
}));

export const StyledModalInnerWorkspace = styled(Box)(({ theme }) => ({
	position: 'relative',
	top: '50%',
	flex: 1,
	display: 'flex',
	// maxWidth: 650,
	width: '100%',
	transform: 'translateY(-50%)',
	maxHeight: '90%',
	'& > .MuiCard-root': {
		display: 'flex',
		'& > *': {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
		},
	},
	'& .MuiCardContent-root': {
		gap: theme.spacing(2),
	},
	'& .MuiCardActions-root': {
		justifyContent: 'flex-end',
		paddingTop: theme.spacing(2),
	},
}));

export const StyledModalContent = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: theme.spacing(4),
	paddingTop: theme.spacing(4),
	paddingBottom: theme.spacing(4),
	textAlign: 'center',
}));
