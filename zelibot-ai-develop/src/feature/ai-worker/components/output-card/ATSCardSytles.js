import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Elements used within ATS cards

export const StyledSectionHeader = styled(Box)(({ theme }) => ({
	padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
	background: theme.palette.primary.darker,
	borderTopLeftRadius: theme.shape.borderRadius,
	borderTopRightRadius: theme.shape.borderRadius,
	'& > *': {
		color: theme.palette.common.white,
		fontWeight: 600,
	},
}));

export const JobAdAvatar = styled(Box)(({ theme }) => ({
	'&': {
		background: theme.palette.grey[400],
		borderRadius: '50%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: theme.spacing(6),
		height: theme.spacing(6),
	},
	'& > svg': {
		color: 'white',
	}
}));