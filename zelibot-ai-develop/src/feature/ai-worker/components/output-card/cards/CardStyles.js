import { styled, alpha } from '@mui/material/styles';
import { Autocomplete, TextField, Stack, Typography, Grid, Button, Box, Alert } from '@mui/material';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import OutputCard from '../OutputCard';

const StyledButton = styled(Button)(({ theme }) => ({
    whiteSpace: 'nowrap',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    '&:hover': {
		background: alpha(theme.palette.primary.dark, 0.85),
	},
    '&.MuiButton-contained': {
        background: '#170058',
    },
    '&.MuiButton-outlined': {
        background: 'transparent',
        border: `1px solid ${theme.palette.primary.dark}`,
    }
}));

const StyledCard = styled(OutputCard)(({ theme }) => ({
    '& > .body': {
        maxHeight: 800,
    },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiFilledInput-root': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[400]}`,
        borderRadius: theme.spacing(0.5),
    },
    '& > .MuiFilledInput-root > .MuiInputBase-input': {
        fontSize: theme.typography.body2,
    },
    '& .MuiFilledInput-root.Mui-focused, & .MuiFilledInput-root:hover': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[400]}`,
    },
}));

const StyledSelect = styled(RHFAutocomplete)(({ theme }) => ({
    '& .MuiFilledInput-root': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[400]}`,
        borderRadius: theme.spacing(0.5),
    },
    '& > .MuiFilledInput-root > .MuiInputBase-input': {
        fontSize: theme.typography.body2,
    },
    '& .MuiFilledInput-root.Mui-focused, & .MuiFilledInput-root:hover': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[400]}`,
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiFilledInput-root': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[400]}`,
        '& .Mui-focused': {
            backgroundColor: 'transparent',
            border: `1px solid ${theme.palette.grey[400]}`,
        }
    }
}));

const StyledControlledTextField = styled(RHFTextField)(({ theme }) => ({
    '& .MuiFilledInput-root': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[400]}`,
        borderRadius: theme.spacing(0.5),
    },
    '& > .MuiFilledInput-root > .MuiInputBase-input': {
        fontSize: theme.typography.body2,
    },
    '& .MuiFilledInput-root.Mui-focused, & .MuiFilledInput-root:hover': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[400]}`,
    },
}));

const StyledControlledTextFieldJobOpening = styled(RHFTextField)(({ theme }) => ({
    
    '& .MuiFilledInput-root': {
        backgroundColor: '#FFF',
        border: `1px solid ${theme.palette.grey[400]}`,
        borderRadius: theme.spacing(0.5),
    },
    '& > .MuiFilledInput-root > .MuiInputBase-input': {
        fontSize: theme.typography.body2,
    },
    '& .MuiFilledInput-root.Mui-focused, & .MuiFilledInput-root:hover': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.grey[400]}`,
    },
}));

const StyledControlledTypographyJobOpening = styled(Typography)(({ theme }) => ({
    my: 1.5,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        '.location-label': {
            color: '#9859E0',
        },
        color: '#9859E0',
    },
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '140%',
    color: '#21054C',
    width: '112px',
    height: '22px',
    transition: 'color 0.3s',
    textWrap: 'nowrap',
  }));

  const StyledControlledTypographyNote = styled(Typography)(({ theme }) => ({
    my: 1.5,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        '.location-label': {
            color: '#9859E0',
        },
        color: '#9859E0',
    },
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '140%',
    color: '#21054C',
    width: '100%',
    height: '22px',
    transition: 'color 0.3s',
    textWrap: 'nowrap',
  }));

  const StyledControlledTypographyJobTitle = styled(Typography)(({ theme }) => ({
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '22px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '140%',
    color: '#21054C',
  }));

  const StyledControlledTypographyJobDetails = styled(Typography)(({ theme }) => ({
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '140%',
    color: '#21054C',
  }));


  const StyledControlledTypographyError = styled(Typography)(({ theme }) => ({
    fontFamily: 'Plus Jakarta Sans',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 500,
    color: 'red',
  }));
export {
    StyledCard,
    StyledTextField,
    StyledButton,
    StyledControlledTextField,
    StyledControlledTextFieldJobOpening,
    StyledControlledTypographyJobOpening,
    StyledControlledTypographyJobTitle,
    StyledControlledTypographyJobDetails,
    StyledControlledTypographyError,
    StyledAutocomplete,
    StyledSelect,
}