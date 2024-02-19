import { Box, styled, Card, Typography } from '@mui/material';

export const Plan = styled(Typography)(({ theme }) => ({
    fontSize: '20px',
    fontWeight: 800,
}));

export const SubscribeCardContainer = styled(Box)(({ theme }) => ({
    padding: 16,
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16
}));

export const DiscountTypography = styled(Typography)(({ theme }) => ({
    background: '#C492F4',
    alignSelf: 'start',
    width: '100%',
    padding: '8px',
    borderRadius: '8px',
    borderBottom: 'rgba(0, 0, 0, 0.12)',
    textAlign: 'center',
    fontWeight: 700
    
}));

export const StrikeTypography = styled('span')(({ theme }) => ({
    color: '#C492F4',
    textDecoration: 'line-through',
    fontSize: '48px',
    paddingRight: '10px'
}));

export const PriceTypography = styled(Typography)(({ theme }) => ({
    fontSize: '48px',
}));

