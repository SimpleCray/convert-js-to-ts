import { Box, styled, Button } from '@mui/material';
import { flex } from 'styled-system';

export const StyledToolbar = styled(Box)(({ theme }) => ({
	'& .end-btn': {
		background: 'red',
	},
	display: 'flex',
	justifyContent: 'end',	
	paddingBottom: theme.spacing(3),
	position: 'absolute',
	bottom: 0,
	left: 0,
	width: '100%',
	height: '100%',
	flexDirection: 'column',
	padding: '24px 24px',
	background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 57.86%, rgba(33, 5, 76, 0.70) 95.54%)',
	backgroundBlendMode: 'multiply',

	'& .hiddenButton': {
        visibility: 'hidden',
    },
}));

export const EndCallToolbarContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: '12px',
	padding: '10px',
	justifyContent: 'space-between',
	width: '100%',
}));

export const CenterContent = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: '12px',
}));

export const GreyButton = styled(Button)(({ theme }) => ({
	background: 'rgba(255, 255, 255, 0.20)',
	color: 'white',
	paddingLeft: '32px',
	paddingRight: '32px',
}));
