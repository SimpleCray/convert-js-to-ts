import { Box, styled } from '@mui/material';
import { left } from 'styled-system';

export const VideoTimeDisplayContainer = styled(Box)(({ theme }) => ({
    borderRadius: '100px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    width: 136,
    height: 48,
    justifyContent: 'space-between',
    background: 'rgba(255, 255, 255, 0.20)'

}));


export const RecordingIcon = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const RecordingTime = styled(Box)(({ theme }) => ({
    display: 'flex',
    flex: 1,            // fill available horizontal space
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '16px',
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '140%',
    color: 'white',
    fontFamily: 'Plus Jakarta Sans',
}));