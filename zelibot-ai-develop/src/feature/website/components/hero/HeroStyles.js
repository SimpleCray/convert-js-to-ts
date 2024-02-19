import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

export const StyledHero = styled('section')(({ theme }) => ({
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	minHeight: '40vh',
	padding: theme.spacing(5, 2),
	gap: theme.spacing(2),
	[theme.breakpoints.up('md')]: {
		height: '100vh',
		minHeight: '500px',
		padding: theme.spacing(5, 5),
	},
	'&.hasImage': {
		[theme.breakpoints.down('md')]: {
			paddingTop: theme.spacing(15),
			paddingBottom: theme.spacing(10),
		},
	},
}));

export const StyledTypographyHeading = styled(Typography, {
	shouldForwardProp: (prop) => prop !== 'textStyle',
})(({ theme, textStyle }) => ({
	position: 'relative',
	fontSize: '100px!important',
	[theme.breakpoints.down('md')]: {
		fontSize: '50px!important',
	},
	'& .text': {
		position: 'relative',
		background: 'linear-gradient(266deg, #FFF 1.53%, #AE8EDA 98.96%)',
		backgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		...(textStyle === 'light'
			? {
					background: 'linear-gradient(266deg, #FFF 1.53%, #fff 98.96%)',
				}
			: textStyle === 'purple'
				? { color: '#6E30C1', textShadow: '0px 0px 60px #FFF, 0px 0px 60px #FFF, 0px 0px 60px #FFF', WebkitTextFillColor: 'none' }
				: {}),
		zIndex: '10',
	},
	'& .bgShadow': {
		position: 'absolute',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
		textShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
	},
}));

export const StyledImageBackground = styled('div')(({ theme }) => ({
	position: 'absolute',
	top: '0',
	left: '0',
	width: '100%',
	height: '100%',
	'& img': {
		objectFit: 'cover',
		objectPosition: 'center',
		height: '100%',
		width: '100%',
	},
	zIndex: '-1',
}));

export const DownArrow = styled('div')(({ theme }) => ({
	position: 'absolute',
	bottom: '0',
	left: '0',
	height: '10%',
	width: '100%',
	maxHeight: '75px',
	// backgroundColor: 'red',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
}));
