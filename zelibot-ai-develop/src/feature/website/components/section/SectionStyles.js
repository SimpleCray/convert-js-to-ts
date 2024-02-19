import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledSection = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'scaleToViewport',
})(({ theme, scaleToViewport, isDesktop }) => ({
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	padding: theme.spacing(5, 2),
	gap: theme.spacing(2),
	[theme.breakpoints.up('md')]: {
		// height: scaleToViewport ? '100vh' : 'auto',
		// minHeight: scaleToViewport ? '500px' : 'auto',
		padding: theme.spacing(0, 0),
		maxHeight: '45rem',
	},
}));

export const StyledSectionAlt = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'scaleToViewport' && prop !== 'paddingType',
})(({ theme, scaleToViewport, background, paddingType, imageSide, isDesktop }) => ({
	position: 'relative',
	display: 'flex',
	background: background ? background : null,
	flexDirection: 'column',
	padding: theme.spacing(4, 0),
	// padding: paddingType === 'vertical' ? theme.spacing(4, 2) : theme.spacing(0, 2),
	// gap: theme.spacing(2),
	[theme.breakpoints.up('md')]: {
		// height: scaleToViewport ? '100vh' : 'auto',
		// minHeight: scaleToViewport ? '400px' : 'auto',
		// padding: imageSide === 'right' ? theme.spacing(5, 0, 5, 5) : theme.spacing(10, 5, 0, 0),
		// maxHeight: '45rem',
	},
}));

export const StyledRibbon = styled('div')(({ theme }) => ({
	position: 'absolute',
	top: '0',
	left: '0',
	width: '100%',
	height: '100%',
	zIndex: '-1',
	'& > *': {
		position: 'relative',
		height: '100%',
		width: '100%',
	},
	'& svg': {
		position: 'absolute',
		height: '100%',
		width: '125%',
		left: '-25%',
	},
}));

export const StyledImageWrapper = styled('div')(({ theme }) => ({
	position: 'relative',
	width: '100%',
	height: '85%',
	overflow: 'hidden',
	'&.column': {
		[theme.breakpoints.down('md')]: {
			height: 'calc(100vw/(16/9))',
		},
		marginBottom: '1rem'
	},
}));

export const StyledImageContent = styled('div')(({ theme }) => ({
	position: 'relative',
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	gap: theme.spacing(4),
	padding: theme.spacing(5, 3),
	margin: 'auto',
	// textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
	color: '#fff',
	[theme.breakpoints.up('md')]: {
		maxWidth: '85%',
	},
}));

export const StyledImage = styled('div')(({ theme, stretch, direction }) => ({
	position: 'absolute',
	width: '100%',
	height: '100%',
	borderRadius: stretch ? null : direction === 'right' ? '3rem 0rem 0rem 3rem' : '0rem 3rem 3rem 0rem',
	left: 0,
	// borderRadius: stretch ? null : theme.spacing(3, 3),
	overflow: 'hidden',
	'& img': {
		width: '105%',
		height: '105%',
		objectFit: 'cover',
	},
	'&.alt': {
		[theme.breakpoints.up('md')]: {
			// borderBottomLeftRadius: 0,
			// borderTopLeftRadius: 0,
		},
	},
}));

export const StyledContent = styled('div')(({ theme }) => ({
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	gap: theme.spacing(4),
	//padding: theme.spacing(5, 2),
	// textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
	color: '#fff',
	[theme.breakpoints.up('md')]: {
		padding: theme.spacing(5, 12),
	},
	'&.column': {
		[theme.breakpoints.down('md')]: {
			padding: theme.spacing(5, 2, 0),
		},
	},
	'&.space-between': {
		justifyContent: 'space-between',
		height: '80%',
		[theme.breakpoints.up('md')]: {
			// flexBasis: '800px',
			paddingTop: theme.spacing(12),
			paddingLeft: theme.spacing(12),
			paddingBottom: 0,
		},
	},
	'&.alt': {
		justifyContent: 'flex-end',
		[theme.breakpoints.up('md')]: {
			flexBasis: '800px',
			paddingLeft: theme.spacing(6),
			paddingBottom: 0,
		},
	},
}));
