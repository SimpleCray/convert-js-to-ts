import { alpha, styled } from '@mui/material/styles';
import { Chip } from '@mui/material';

export const StyledPromptCard = styled(Chip)(({ theme }) => ({
	background: theme.palette.background.paper,
	color: theme.palette.text.primary,
	width: 'max-content',
	'&:hover': {
		background: alpha(theme.palette.background.paper, 0.85),
	},
	'& .MuiChip-icon': {
		fill: `url(#gradient-svg) ${theme.palette.primary.main}`,
		opacity: 1,
	},
	'&.outlined': { border: `1px solid ${theme.palette.primary.main}` },
}));
