import { styled } from '@mui/material/styles';

export const StyledCTASection = styled('div')(({ theme }) => ({
	position: 'relative',
	padding: theme.spacing(5, 5),
	// borderRadius: theme.spacing(3),
	// backgroundImage: 'url(/assets/images/cta-section-bg.jpg)',
	background: 'linear-gradient(132.18deg, rgba(241, 177, 208, 0.75) 4.46%, rgba(194, 183, 238, 0.75) 70.14%)',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	[theme.breakpoints.up('md')]: {
		padding: theme.spacing(10, 10),
	},
	color: theme.palette.common.white,
	'& .MuiInputBase-root, & .MuiFormHelperText-root.Mui-error': {
		color: '#fff',
	},
	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: '#fff!important',
	},
	'& .MuiFormLabel-root.Mui-focused, & .MuiFormLabel-root.Mui-error, & .MuiFormLabel-root.MuiInputLabel-shrink': {
		color: '#fff!important',
	},
	overflow: 'hidden',
}));

export const StyledInnerWrap = styled('div')(({ theme }) => ({
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(3),
	[theme.breakpoints.up('md')]: {
		maxWidth: '85%',
		margin: '0 auto',
		gap: theme.spacing(5),
	},
	zIndex: '1',
	'& > div': {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(3),
		[theme.breakpoints.up('md')]: {
			gap: theme.spacing(5),
		},
	},
}));

export const StyledRibbon = styled('div')(({ theme }) => ({
	position: 'absolute',
	top: '0',
	left: '0',
	width: '100%',
	height: '100%',
	'& > *': {
		position: 'relative',
		height: '100%',
		width: '100%',
	},
	'& svg': {
		position: 'absolute',
		height: '180%',
		width: '140%',
		top: '-50%',
		left: '-25%',
	},
}));
