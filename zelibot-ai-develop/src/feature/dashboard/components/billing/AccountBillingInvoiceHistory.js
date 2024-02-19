import PropTypes from 'prop-types';
// @mui
import { Stack, Button, Typography, CircularProgress } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import { Iconify } from '@zelibot/zeligate-ui';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../invoice/details/InvoicePDF';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

AccountBillingInvoiceHistory.propTypes = {
	invoices: PropTypes.array,
};

export default function AccountBillingInvoiceHistory({ invoices, invoiceFrom, invoiceTo }) {
	const { push } = useRouter();

	const handleInvoicesClick = () => {
		void push(PATH_DASHBOARD.billing.invoices);
	};

	return (
		<Stack spacing={3} alignItems='flex-end'>
			<Typography variant='overline' sx={{ width: 1, color: 'text.secondary' }}>
				Invoice History
			</Typography>

			<Stack spacing={2} sx={{ width: 1 }}>
				{invoices.length === 0 && (
					<Typography variant='body2' sx={{ width: 1, color: 'text.secondary' }}>
						You don't have any invoices yet.
					</Typography>
				)}
				{invoices?.map((invoice) => (
					<Stack key={invoice.invoiceId} direction='row' justifyContent='space-between' sx={{ width: 1 }}>
						<Typography variant='body2' sx={{ minWidth: 120 }}>
							{fDate(invoice.invoiceDate)}
						</Typography>

						<Typography variant='body2'>{fCurrency(invoice.invoicePaymentAmount, true)}</Typography>

						{/* <PDFDownloadLink
                      document={<InvoicePDF invoice={invoice} invoiceFrom={invoiceFrom} invoiceTo={invoiceTo} />}
                      fileName={invoice.invoiceId}
                  >
                      {({ loading }) => (
                          <>
                              {loading ? (
                                  <>
                                      <CircularProgress size={24} color="inherit" />
                                  </>
                              ) : (
                                  <>
                                      PDF
                                  </>
                              )}
                          </>
                      )}
                  </PDFDownloadLink> */}
					</Stack>
				))}
			</Stack>

			{invoices.length !== 0 && (
				<Button size='small' color='inherit' endIcon={<Iconify icon='eva:arrow-ios-forward-fill' />} onClick={handleInvoicesClick}>
					All invoices
				</Button>
			)}
		</Stack>
	);
}
