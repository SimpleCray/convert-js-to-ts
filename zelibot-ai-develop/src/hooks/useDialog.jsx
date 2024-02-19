import React from 'react';
import { isValidElement, useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, styled, Stack, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// type DialogInfoType = {
//   title?: string;
//   content?: string | ReactElement;
//   handleConfirm: () => void;
//   handleDecline?: () => void;
//   approveText?: string;
//   disapproveText?: string;
//   hideApproveButton?: boolean;
//   hideDisapproveButton?: boolean;
//   showCloseIcon?: boolean;
//   additionalStyles?: SxProps<Theme>;
// };

const StyledDialog = styled(Dialog)({
	'& .MuiDialog-paper': {
		padding: '24px',
	},
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const useDialog = ({ isLoading }) => {
	const [open, setOpen] = useState(null);

	const handleOpenDialog = (info) => {
		setOpen(info);
	};

	const handleCloseDialog = () => {
		setOpen(null);
	};

	const renderDialog = useMemo(
		() =>
			open ? (
				<StyledDialog open={!!open} onClose={handleCloseDialog} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description' sx={open?.additionalStyles ? { ...open.additionalStyles } : {}}>
					<Stack gap={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
						{open?.title && (
							<DialogTitle id='alert-dialog-title' style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
								{open.title}
							</DialogTitle>
						)}
						{open?.showCloseIcon ? (
							<IconButton
								aria-label='close'
								onClick={handleCloseDialog}
								style={{
									position: 'absolute',
									right: 8,
									top: 8,
									color: '#fff',
								}}
							>
								<CloseIcon />
							</IconButton>
						) : null}
						{open?.content && (
							<DialogContent>
								{isValidElement(open.content) ? (
									open.content
								) : (
									<DialogContentText id='alert-dialog-description' style={{ fontSize: 16, fontWeight: 400, color: '#fff' }}>
										{open.content}
									</DialogContentText>
								)}
							</DialogContent>
						)}
						<DialogActions sx={{ padding: 0 }} style={{ background: 'inherit' }}>
							<Stack direction='row' sx={{ gap: 2, width: '100%' }}>
								{open.hideDisapproveButton ? null : (
									<Button disabled={isLoading} onClick={open?.handleDecline ? open.handleDecline : handleCloseDialog} variant='outlined' color='primary' style={{ flex: 1 }}>
										{open?.disapproveText ?? 'No'}
									</Button>
								)}
								{open.hideApproveButton ? null : (
									<Button px={2} disabled={isLoading} onClick={open?.handleConfirm} autoFocus variant='contained' color='primary'>
										{isLoading ? <CircularProgress size={24} color='inherit' /> : open?.approveText ?? 'Yes'}
									</Button>
								)}
							</Stack>
						</DialogActions>
					</Stack>
				</StyledDialog>
			) : null,
		[open, isLoading]
	);

	return { renderDialog, handleOpenDialog, handleCloseDialog };
};

export default useDialog;
