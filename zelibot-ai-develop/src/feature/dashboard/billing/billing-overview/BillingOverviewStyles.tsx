import { Box, styled, Typography, Stack } from '@mui/material';


export const DataGridStyles = {
    '& .MuiDataGrid-columnHeaders': {
        background: '#21054C',
        color: 'white',
        borderRadius: '8px 8px 0px 0px',
        height: '36px !important',
    },
    '& .MuiIconButton-root': {
        color: 'white',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: '600',
    },
};

export const SectionTypography = styled(Typography)(({ theme }) => ({
    fontSize: '16px',
    fontWeight: '600',
    color: '#21054C'
}));

export const SubHeading = styled(Typography)(({ theme }) => ({
    fontSize: '16px',
    fontWeight: '600',
    color: '#9859E0'
}));

export const BoldHeader = styled(Typography)(({ theme }) => ({
    fontSize: '14px',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
}));

export const CardType = styled(Box)(({theme}) => ({
    fontSize: '12px',
    padding: '1px 3px',
    border: '2px solid lightgray',
    color: 'blue',
    borderRadius: 2

}))

export const PurchaseHistoryCont = styled(Stack)(({ theme }) => ({
    color: 'inherit',
    borderBottom: '1px solid #21054C'
}));