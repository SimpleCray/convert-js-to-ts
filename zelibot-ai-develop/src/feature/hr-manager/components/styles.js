// @mui
import { alpha, styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

export const StyledHistoryItem = styled(Stack)(({ theme }) => ({
	position: 'relative',
	border: '1px solid',
	borderColor: theme.palette.grey[300],
	borderRadius: '8px',
}));

export const StyledHistoryItemTitle = styled(Typography)(({ theme }) => ({
	position: 'absolute',
	color: theme.palette.text.disabled,
	top: '-10px',
	left: '50%',
	transform: 'translateX(-50%)',
	paddingLeft: 10,
	paddingRight: 10,
	background: '#fff',
	width: 'max-content',
}));
