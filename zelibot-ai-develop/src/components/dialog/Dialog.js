import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ isOpen, onClose, title = '', content, btnLabel, submitBtnLabel, onSubmit }) {

    return (
        <>
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent sx={{ margin: '8px 8px 8px' }}>
                    {content}
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    {btnLabel && <Button variant={submitBtnLabel ? 'outlined' : 'contained'} color={'primary'} onClick={onClose}>{btnLabel}</Button>}
                    {submitBtnLabel && onSubmit && <Button variant={'contained'} color={'primary'} onClick={onSubmit}>{submitBtnLabel}</Button>}

                </DialogActions>
            </Dialog>
        </>
    );
}