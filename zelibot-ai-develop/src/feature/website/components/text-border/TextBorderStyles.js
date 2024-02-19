import { styled } from '@mui/material/styles';

export const StyledBorder = styled('div')(({ theme }) => ({
	'& span.underline': {
		position: 'relative',
		'& svg': {
			position: 'absolute',
			top: '100%',
			left: 0,
			width: '100%',
			height: '2px',
		},
	},
}));
