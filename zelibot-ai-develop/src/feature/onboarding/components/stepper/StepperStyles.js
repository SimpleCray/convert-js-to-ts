import { alpha, styled } from '@mui/material/styles';
import { Stepper } from '@mui/material';

export const StyledStepper = styled(Stepper)(({ theme }) => ({
	'& .MuiStepLabel-label': {
		color: alpha(theme.palette.common.white, 0.4),
		'&.Mui-active': {
			color: theme.palette.common.white,
			fontSize: 20,
			fontWeight: 700,
			backgroundColor: alpha(theme.palette.common.white, 0.08),
			padding: '4px 8px',
			borderRadius: '8px',
		},
		'&.Mui-completed': {
			color: theme.palette.common.white,
		},
	},
	'& .MuiSvgIcon-root-MuiStepIcon-root': {
		color: theme.palette.common.white,
	},
	'& .MuiSvgIcon-root': {
		color: alpha(theme.palette.common.white, 0.4),
		'&.Mui-active': {
			color: theme.palette.common.white,
			'& .MuiStepIcon-text': {
				fontSize: 16,
				fontWeight: 900,
			},
		},
		'&.Mui-completed': {
			color: theme.palette.common.white,
		},
	},
	'& .MuiStepIcon-text': {
		fill: theme.palette.primary.main,
	},
    '& .Mui-completed + .MuiStepConnector-root .MuiStepConnector-line': {
        borderColor: alpha(theme.palette.common.white, 1.0),
    },
	'& .MuiStepConnector-line': {
		borderColor: alpha(theme.palette.common.white, 0.4),
	},
}));
