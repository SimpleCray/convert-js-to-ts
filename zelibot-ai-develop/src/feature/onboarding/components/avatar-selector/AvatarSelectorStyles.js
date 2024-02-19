import { styled } from '@mui/material/styles';

export const StyledAvatarSelector = styled('div')(({ theme }) => ({
	position: 'relative',
	display: 'flex',
	borderRadius: '100%',
	width: 100,
	height: 100,
	cursor: 'pointer',
	'&.has-action.selected': {
		boxShadow: theme.shadows[8],
		'&:after': {
			content: '""',
			position: 'absolute',
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			border: '4px solid #fff',
		},
	},
	'& img': {
		padding: 0,
		borderRadius: '100%',
		width: '100%',
		height: '100%',
		textAlign: 'center',
		objectFit: 'cover',
	},
	'& video': {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		borderRadius: '100%',
	},
	'&:not(.has-action)': {
		width: 250,
		height: 250,
		maxWidth: '100%',
		cursor: 'default',
		transition: 'all 0.3s ease',
		'&.selected': {
			'&:before': {
				content: '""',
				position: 'absolute',
				width: '100%',
				height: '100%',
				borderRadius: '100%',
				border: `4px solid ${theme.palette.secondary.main}`,
			},
			'&.lighter-border:before': {
				border: `10px solid ${theme.palette.primary.lighter}`,
			},
			'& img': {
				padding: 18,
				borderRadius: '100%',
			},
			'& video': {
				padding: 18,
			},
			'&.lighter-border video': {
				padding: 10,
			},
		},
		[theme.breakpoints.down('md')]: {
			width: 165,
			height: 165,
			transform: 'scale(0.8)',
			'&.selected': {
				transform: 'scale(1)',
				'& img, & video': {
					padding: 8,
				},
			},
		},
	},
}));
