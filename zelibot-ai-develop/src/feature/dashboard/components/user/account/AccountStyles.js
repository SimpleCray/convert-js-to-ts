import {alpha, styled} from '@mui/material/styles';
import {Button, Typography} from '@mui/material';
import {LoadingButton} from "@mui/lab";

export const StyledButton = styled(Button)(({ theme }) => ({
    whiteSpace: 'nowrap',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    color: '#170058',
    '&:hover': {
		background: alpha(theme.palette.primary.main, 0.85),
	},
    '&.MuiButton-outlined': {
        background: 'transparent',
        border: `1px solid ${theme.palette.primary.dark}`,
        '&:before': {
            borderColor: theme.palette.primary.main,
        },
    }
}));

export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
    whiteSpace: 'nowrap',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    background: '#170058',
}));

export const StyledTypography = styled(Typography)(({ theme, variant = 'body1' }) => {
    switch (variant) {
        case 'h1':
            return {
                textAlign: 'center',
                fontWeight: 400,
                lineHeight: 1.3,
                letterSpacing: -0.55,
                [theme.breakpoints.up('sm')]: {
                    fontSize: 55,
                },
            };
        case 'subtitle1':
            return {
                textAlign: 'center',
                fontSize: 16.5,
                fontWeight: 400,
                lineHeight: 1.3,
            };
        case 'body1':
            return {
                textAlign: 'left',
                fontSize: 16.5,
                fontWeight: 400,
                lineHeight: 1.3,
            };
        default:
            return {};
    };
});
