import { styled } from '@mui/material';

export const ExpiredMeetingContainer = styled('div')(({ theme }) => ({
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
