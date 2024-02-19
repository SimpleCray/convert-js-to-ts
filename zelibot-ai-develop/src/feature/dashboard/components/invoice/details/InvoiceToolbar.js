import PropTypes from 'prop-types';
import { PDFDownloadLink } from '@react-pdf/renderer';
// @mui
import { Stack, Tooltip, IconButton, CircularProgress } from '@mui/material';
// components
import { Iconify } from '@zelibot/zeligate-ui';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

InvoiceToolbar.propTypes = {
	invoice: PropTypes.object,
};

export default function InvoiceToolbar({ invoiceId, setPrint, print, document = {} }) {
	return (
		<>
			<Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} justifyContent='flex-end' alignItems={{ sm: 'center' }} sx={{ mb: 1 }}>
				<Stack direction='row' spacing={1}>
					<PDFDownloadLink document={document} fileName={invoiceId} style={{ textDecoration: 'none' }}>
						{({ loading }) => (
							<Tooltip title='Download'>
								<IconButton>{loading ? <CircularProgress size={24} color='inherit' /> : <Iconify icon='eva:download-fill' />}</IconButton>
							</Tooltip>
						)}
					</PDFDownloadLink>

					<Tooltip title='Print'>
						<IconButton onClick={print ? setPrint : null}>
							<Iconify icon='eva:printer-fill' />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>
		</>
	);
}
