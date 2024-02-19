import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Grid, Table, Divider, TableRow, TableBody, TableHead, TableCell, Typography, TableContainer } from '@mui/material';
// utils
import { fDate } from '../../../../../utils/formatTime';
import { fCurrency } from '../../../../../utils/formatNumber';
// components
import Image from '../../../../../components/image';
import Scrollbar from '../../../../../components/scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';
import InvoicePDF from './InvoicePDF';
import { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledRowResult = styled(TableRow)(({ theme }) => ({
	'& td': {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
	},
}));

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
	invoice: PropTypes.object,
};

export default function InvoiceDetails({ invoice, invoiceFrom, invoiceTo }) {
	if (!invoice) {
		return null;
	}

	const documentPDF = <InvoicePDF invoice={invoice} invoiceFrom={invoiceFrom} invoiceTo={invoiceTo} />;

	const [isPrint, setIsPrint] = useState(false);

	const closePrint = () => {
		setIsPrint(false);
	};

	const setPrint = () => {
		const iframe = document.getElementById('pdfRender');
		iframe.contentWindow.focus(); // Required for IE
		iframe.contentWindow.print();
	};

	const handlePrint = () => {
		setIsPrint(true);
		setPrint();
		closePrint();
	};

	return (
		<>
			<Card sx={{ pt: 5, px: 5 }}>
				<Grid container>
					<Grid item xs={12} sm={6} sx={{ mb: 5 }}>
						<Image disabledEffect alt='logo' src='/logo/logo_full.svg' sx={{ maxWidth: 120 }} />
					</Grid>

					<Grid item xs={12} sm={6} sx={{ mb: 5 }}>
						<Box sx={{ textAlign: { sm: 'right' } }}>
							<InvoiceToolbar invoiceId={invoice?.invoiceNumber} document={documentPDF} setPrint={handlePrint} print={print} />
							<Typography variant='h6'>{invoice?.invoiceNumber}</Typography>
						</Box>
					</Grid>

					<Grid item xs={12} sm={6} sx={{ mb: 5 }}>
						<Typography paragraph variant='overline' sx={{ color: 'text.disabled' }}>
							Invoice from
						</Typography>

						<Typography variant='body2'>{invoiceFrom?.name}</Typography>

						<Typography variant='body2'>{invoiceFrom?.address}</Typography>

						<Box sx={{ mt: 2 }}>
							<Typography variant='body2'>Email: {invoiceFrom?.email}</Typography>
							<Typography variant='body2'>Phone: {invoiceFrom?.phone}</Typography>
						</Box>
					</Grid>

					<Grid item xs={12} sm={6} sx={{ mb: 5 }}>
						<Typography paragraph variant='overline' sx={{ color: 'text.disabled' }}>
							Invoice to
						</Typography>

						<Typography variant='body2'>{`${invoice?.customerName}`}</Typography>

						{invoiceTo?.address && (
							<>
								<Typography variant='body2'>{invoiceTo?.address || ''}</Typography>
								<Typography variant='body2'>{`${invoiceTo?.city || ''} ${invoiceTo?.stateName || ''} ${invoiceTo?.postCode || ''}`}</Typography>
								<Typography variant='body2'>{invoiceTo?.country || ''}</Typography>
							</>
						)}
						<Box sx={{ mt: 2 }}>
							<Typography variant='body2'>Email: {invoice?.customerEmail}</Typography>
							<Typography variant='body2'>{invoiceTo?.phoneNumber && `Phone: ${invoiceTo?.phoneNumber || ''}`}</Typography>
						</Box>
					</Grid>

					<Grid item xs={12} sm={6} sx={{ mb: 5 }}>
						<Typography paragraph variant='overline' sx={{ color: 'text.disabled' }}>
							date created
						</Typography>

						<Typography variant='body2'>{fDate(invoice?.invoiceDate)}</Typography>
					</Grid>

					<Grid item xs={12} sm={6} sx={{ mb: 5 }}>
						<Typography paragraph variant='overline' sx={{ color: 'text.disabled' }}>
							date paid
						</Typography>

						<Typography variant='body2'>{fDate(invoice?.invoicePaymentDate)}</Typography>
					</Grid>
				</Grid>

				<TableContainer sx={{ overflow: 'unset' }}>
					<Scrollbar>
						<Table sx={{ minWidth: 960 }}>
							<TableHead
								sx={{
									borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
									'& th': { backgroundColor: 'transparent' },
								}}
							>
								<TableRow>
									<TableCell width={40}>#</TableCell>

									<TableCell align='left'>Description</TableCell>

									<TableCell align='left'>Qty</TableCell>

									<TableCell align='right'>Unit price</TableCell>

									<TableCell align='right'>Total</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{invoice?.invoiceItems?.map((row, index) => (
									<TableRow
										key={index}
										sx={{
											borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
										}}
									>
										<TableCell>{index + 1}</TableCell>

										<TableCell align='left'>
											<Box sx={{ maxWidth: 560 }}>
												<Typography variant='subtitle2'>{row?.itemTitle}</Typography>

												<Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
													{row?.itemDescription}
												</Typography>
											</Box>
										</TableCell>

										<TableCell align='left'>1</TableCell>

										<TableCell align='right'>{fCurrency(row?.itemAmount / 100)}</TableCell>

										<TableCell align='right'>{fCurrency(row?.itemAmount / 100)}</TableCell>
									</TableRow>
								))}

								<StyledRowResult>
									<TableCell colSpan={3} />

									<TableCell align='right' sx={{ typography: 'body1' }}>
										<Box sx={{ mt: 2 }} />
										Subtotal
									</TableCell>

									<TableCell align='right' width={120} sx={{ typography: 'body1' }}>
										<Box sx={{ mt: 2 }} />
										{fCurrency(invoice?.invoiceAmount / 100)}
									</TableCell>
								</StyledRowResult>

								{invoice?.invoiceDiscount > 0 && (
									<StyledRowResult>
										<TableCell colSpan={3} />

										<TableCell align='right' sx={{ typography: 'body1' }}>
											Discount
										</TableCell>

										<TableCell align='right' width={120} sx={{ color: 'error.main', typography: 'body1' }}>
											{invoice?.invoiceDiscount && fCurrency(-invoice?.invoiceDiscount / 100)}
										</TableCell>
									</StyledRowResult>
								)}

								<StyledRowResult>
									<TableCell colSpan={3} />

									<TableCell align='right' sx={{ typography: 'body1' }}>
										Taxes
									</TableCell>

									<TableCell align='right' width={120} sx={{ typography: 'body1' }}>
										{invoice?.invoiceTax && fCurrency(invoice?.invoiceTax / 100)}
									</TableCell>
								</StyledRowResult>

								<StyledRowResult>
									<TableCell colSpan={3} />

									<TableCell align='right' sx={{ typography: 'h6' }}>
										Total
									</TableCell>

									<TableCell align='right' width={140} sx={{ typography: 'h6' }}>
										{fCurrency(invoice?.invoicePaymentAmount / 100)}
									</TableCell>
								</StyledRowResult>
							</TableBody>
						</Table>
					</Scrollbar>
				</TableContainer>

				<Divider sx={{ mt: 5 }} />

				<Grid container>
					<Grid item xs={12} md={9} sx={{ py: 3 }}>
						<Typography variant='subtitle2'>NOTES</Typography>

						<Typography variant='body2'>{invoice?.invoiceNotes}</Typography>
					</Grid>

					<Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
						<Typography variant='subtitle2'>Have a Question?</Typography>

						<Typography variant='body2'>{invoiceFrom?.email}</Typography>
					</Grid>
				</Grid>
			</Card>
			<PDFViewer width='100%' height='100%' id={'pdfRender'} style={{ height: 0, width: 0, position: 'fixed', bottom: 0, right: 0, border: 0 }}>
				{documentPDF}
			</PDFViewer>
		</>
	);
}
