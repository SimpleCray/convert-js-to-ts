import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledAIActivityHeader = styled(Box)(({ theme }) => ({
	textAlign: 'center',
	marginBottom: theme.spacing(2),
	'& .MuiDivider-root': {
		marginTop: theme.spacing(0.5),
		marginBottom: theme.spacing(0.5),
	},
	[theme.breakpoints.up('md')]: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
	},
}));
