import { useRef, useEffect } from 'react';
// @mui
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { PRIVACY_PAGE } from '../constants';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function PrivacyDialog({ handleClose, open }) {
	const { title, content } = PRIVACY_PAGE;
	const descriptionElementRef = useRef(null);

	useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement) {
				descriptionElement.focus();
			}
		}
	}, [open]);

	return (
		<>
			<Dialog open={open} onClose={handleClose} scroll={'paper'}>
				<DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

				<DialogContent dividers={true}>
					<DialogContentText id='scroll-dialog-description' ref={descriptionElementRef} tabIndex={-1}>
						<div dangerouslySetInnerHTML={{ __html: content }} />
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
