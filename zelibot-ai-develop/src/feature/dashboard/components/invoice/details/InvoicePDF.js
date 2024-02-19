/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
// utils
import { fDate } from '../../../../../utils/formatTime';
import { fCurrency } from '../../../../../utils/formatNumber';
//
import styles from './InvoiceStyle';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
	invoice: PropTypes.object,
};

export default function InvoicePDF({ invoice, invoiceTo, invoiceFrom }) {
	return (
		<Document>
			<Page size='A4' style={styles.page}>
				<View style={[styles.gridContainer, styles.mb40]}>
					<Image source='/logo/logo_full.jpg' style={{ height: 32 }} />
					<View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
						<Text> {invoice?.invoiceNumber} </Text>
					</View>
				</View>

				<View style={[styles.gridContainer, styles.mb40]}>
					<View style={styles.col6}>
						<Text style={[styles.overline, styles.mb8]}>Invoice from</Text>
						<Text style={styles.body1}>{invoiceFrom.name}</Text>
						<Text style={styles.body1}>{invoiceFrom.address}</Text>
						<Text style={styles.body1}>Email: {invoiceFrom.email}</Text>
						<Text style={styles.body1}>Phone: {invoiceFrom.phone}</Text>
					</View>

					<View style={styles.col6}>
						<Text style={[styles.overline, styles.mb8]}>Invoice to</Text>
						<Text style={styles.body1}>{`${invoice?.customerName}`}</Text>
						{invoiceTo?.address && (
							<>
								<Text style={styles.body1}>{invoiceTo?.address || ''}</Text>
								<Text style={styles.body1}>
									{invoiceTo?.city || ''} {invoiceTo?.stateName || ''} {invoiceTo?.postCode || ''}
								</Text>
								<Text style={styles.body1}>{invoiceTo?.country || ''}</Text>
							</>
						)}
						<Text style={styles.body1}>Email: {invoice?.customerEmail}</Text>
						<Text style={styles.body1}>{invoiceTo?.phoneNumber ? 'Phone: ' + invoiceTo?.phoneNumber : ''}</Text>
					</View>
				</View>

				<View style={[styles.gridContainer, styles.mb40]}>
					<View style={styles.col6}>
						<Text style={[styles.overline, styles.mb8]}>Date created</Text>
						<Text style={styles.body1}>{fDate(invoice?.invoiceDate)}</Text>
					</View>
					<View style={styles.col6}>
						<Text style={[styles.overline, styles.mb8]}>Date paid</Text>
						<Text style={styles.body1}>{fDate(invoice?.invoicePaymentDate)}</Text>
					</View>
				</View>

				<Text style={[styles.overline, styles.mb8]}>Invoice Details</Text>

				<View style={styles.table}>
					<View style={styles.tableHeader}>
						<View style={styles.tableRow}>
							<View style={styles.tableCell_1}>
								<Text style={styles.subtitle2}>#</Text>
							</View>

							<View style={styles.tableCell_2}>
								<Text style={styles.subtitle2}>Description</Text>
							</View>

							<View style={styles.tableCell_3}>
								<Text style={styles.subtitle2}>Qty</Text>
							</View>

							<View style={styles.tableCell_3}>
								<Text style={styles.subtitle2}>Unit price</Text>
							</View>

							<View style={[styles.tableCell_3, styles.alignRight]}>
								<Text style={styles.subtitle2}>Total</Text>
							</View>
						</View>
					</View>

					<View style={styles.tableBody}>
						{invoice?.invoiceItems?.map((item, index) => (
							<View style={styles.tableRow} key={item?.invoiceItemId}>
								<View style={styles.tableCell_1}>
									<Text>{index + 1}</Text>
								</View>

								<View style={styles.tableCell_2}>
									<Text style={styles.subtitle2}>{item?.itemTitle}</Text>
									<Text>{item?.itemDescription}</Text>
								</View>

								<View style={styles.tableCell_3}>
									<Text>1</Text>
								</View>

								<View style={styles.tableCell_3}>
									<Text>{fCurrency(item?.itemAmount / 100)}</Text>
								</View>

								<View style={[styles.tableCell_3, styles.alignRight]}>
									<Text>{fCurrency(item?.itemAmount / 100)}</Text>
								</View>
							</View>
						))}

						<View style={[styles.tableRow, styles.noBorder]}>
							<View style={styles.tableCell_1} />
							<View style={styles.tableCell_2} />
							<View style={styles.tableCell_3} />
							<View style={styles.tableCell_3}>
								<Text>Subtotal</Text>
							</View>
							<View style={[styles.tableCell_3, styles.alignRight]}>
								<Text>{fCurrency(invoice?.invoiceAmount / 100)}</Text>
							</View>
						</View>

						<View style={[styles.tableRow, styles.noBorder]}>
							<View style={styles.tableCell_1} />
							<View style={styles.tableCell_2} />
							<View style={styles.tableCell_3} />
							{invoice?.invoiceDiscount && (
								<>
									<View style={styles.tableCell_3}>
										<Text>Discount</Text>
									</View>
									<View style={[styles.tableCell_3, styles.alignRight]}>
										<Text>{fCurrency(-invoice?.invoiceDiscount)}</Text>
									</View>
								</>
							)}
						</View>

						<View style={[styles.tableRow, styles.noBorder]}>
							<View style={styles.tableCell_1} />
							<View style={styles.tableCell_2} />
							<View style={styles.tableCell_3} />
							<View style={styles.tableCell_3}>
								<Text>Taxes</Text>
							</View>
							<View style={[styles.tableCell_3, styles.alignRight]}>
								<Text>{fCurrency(invoice?.invoiceTax / 100)}</Text>
							</View>
						</View>

						<View style={[styles.tableRow, styles.noBorder]}>
							<View style={styles.tableCell_1} />
							<View style={styles.tableCell_2} />
							<View style={styles.tableCell_3} />
							<View style={styles.tableCell_3}>
								<Text style={styles.h4}>Total</Text>
							</View>
							<View style={[styles.tableCell_3, styles.alignRight]}>
								<Text style={styles.h4}>{fCurrency(invoice?.invoicePaymentAmount / 100)}</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={[styles.gridContainer, styles.footer]}>
					<View style={styles.col8}>
						<Text style={styles.subtitle2}>NOTES</Text>
						<Text>{invoice?.invoiceNotes}</Text>
					</View>
					<View style={[styles.col4, styles.alignRight]}>
						<Text style={styles.subtitle2}>Have a Question?</Text>
						<Text>{invoiceFrom?.email}</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
}
