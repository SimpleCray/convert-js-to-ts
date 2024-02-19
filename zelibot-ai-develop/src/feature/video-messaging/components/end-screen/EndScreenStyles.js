import { Box, styled } from '@mui/material';
import { flex } from 'styled-system';

export const EndScreenContainer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    margin: 'auto 0',
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
    alignSelf: 'center',
    gap: '16px'
}));

export const HighlightText = styled(({ theme }) => ({
    fontWeight: 700,

}));
