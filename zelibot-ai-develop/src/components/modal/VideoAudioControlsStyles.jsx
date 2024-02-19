import { Box, styled } from '@mui/material';
import { left } from 'styled-system';

export const VideoControlsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    margin: 24,
    flexDirection: 'column'

}));

export const PreviewVideoContainer = styled(Box)(({ theme }) => ({
    width: '80%',
    height: 'auto'

}));
