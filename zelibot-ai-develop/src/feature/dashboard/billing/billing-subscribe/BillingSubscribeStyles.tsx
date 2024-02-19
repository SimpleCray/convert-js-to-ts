import { Box, styled, Typography } from '@mui/material';

export const BillingSubscribeContainer = styled(Box)(({ theme }) => ({
	height: '500px',
	overflow: 'auto',
    background: 'linear-gradient(132deg, #B46D8F 8.44%, #370F67 40.29%, #000 92.54%)',
    borderRadius: 8,
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
}));

export const TopUpPackTypography = styled(Typography)(({ theme }) => ({
    background: '#C492F4',
    alignSelf: 'start',
    width: '100%',
    padding: '4px 8px',
    borderRadius: '8px 8px 0px 0px',
    borderBottom: 'rgba(0, 0, 0, 0.12)',
    marginTop: 32
    
}));

