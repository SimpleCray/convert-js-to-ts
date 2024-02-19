import { Box, Card, Grid, styled } from '@mui/material';

export const StyledAuthLayout = styled('main')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	padding: theme.spacing(2),
	height: '100%',
	width: '100%',
	justifyContent: '100%',
}));

export const StyledHeader = styled(Box)(({ theme }) => ({
	'& .logoFull': {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'& svg': {
			[theme.breakpoints.up('md')]: {
				maxHeight: 60,
			},
			'& path': {
				fill: theme.palette.common.white,
			},
		},
	},
}));

export const StyledAuthWrapper = styled(Grid)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
	gap: theme.spacing(6),
    width: 'fit-content',		// <-- !!
    margin: 'auto',

	[theme.breakpoints.down('md')]: {
		gap: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
		gap: theme.spacing(2),
    },
}));

export const StyledContent = styled(Card)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: theme.spacing(4),
	marginBottom: theme.spacing(1),
	gap: theme.spacing(4),
	borderRadius: Number(theme.shape.borderRadius) * 2,

	[theme.breakpoints.up('md')]: {
		paddingTop: theme.spacing(3),
	},

	[theme.breakpoints.down('md')]: {
		gap: theme.spacing(2),
		padding: theme.spacing(2),
	},
}));

export const StyledImageWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
    maxWidth: '1000px', 	// Default max width

    [theme.breakpoints.down('lg')]: {
        maxWidth: '800px', 	// Smaller max width on large screens
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '600px', 	// Smaller max width on medium screens
    },
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100%', 	// Take full width on small screens
    },
}));
