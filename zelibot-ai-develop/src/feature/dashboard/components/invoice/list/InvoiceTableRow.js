import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Chip, Link, Stack, TableRow, MenuItem, TableCell, IconButton, CircularProgress } from '@mui/material';
// utils
import { fDate } from '../../../../../utils/formatTime';
import { fCurrency } from '../../../../../utils/formatNumber';
// components
import { Iconify } from '@zelibot/zeligate-ui';
import MenuPopover from '../../../../../components/menu-popover';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../details/InvoicePDF';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

InvoiceTableRow.propTypes = {
	row: PropTypes.object,
	selected: PropTypes.bool,
	onEditRow: PropTypes.func,
	onViewRow: PropTypes.func,
	onDeleteRow: PropTypes.func,
	onSelectRow: PropTypes.func,
};

export default function InvoiceTableRow({ row, onViewRow, invoiceTo, invoiceFrom }) {
	const [openPopover, setOpenPopover] = useState(null);

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	return (
		<>
			<TableRow hover>
				<TableCell onClick={onViewRow} sx={{ cursor: 'pointer' }}>
					<Stack direction='row' alignItems='center' spacing={2}>
						<div>
							<Link noWrap variant='subtitle2' sx={{ color: 'text.primary' }}>
								{row?.invoiceNumber}
							</Link>
						</div>
					</Stack>
				</TableCell>

				<TableCell align='right'>{fCurrency(row?.invoicePaymentAmount / 100)}</TableCell>

				<TableCell align='right'>
					<Chip label={row?.status} color={'primary'} variant={'soft'} sx={{ textTransform: 'Capitalize', pointerEvents: 'none' }} />
				</TableCell>

				<TableCell align='right'>{fDate(row?.invoiceDate)}</TableCell>

				<TableCell align='right'>
					<IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
						<Iconify icon='eva:more-vertical-fill' />
					</IconButton>
				</TableCell>
			</TableRow>

			<MenuPopover open={openPopover} onClose={handleClosePopover} arrow='right-top' sx={{ width: 160 }}>
				<MenuItem
					onClick={() => {
						onViewRow();
						handleClosePopover();
					}}
				>
					<Iconify icon='eva:eye-fill' />
					View
				</MenuItem>

				<PDFDownloadLink document={<InvoicePDF invoice={row} invoiceFrom={invoiceFrom} invoiceTo={invoiceTo} />} fileName={row?.invoiceId} style={{ textDecoration: 'none', color: 'inherit' }}>
					{({ loading }) => (
						<MenuItem
							onClick={() => {
								handleClosePopover();
							}}
						>
							{loading ? (
								<>
									<CircularProgress size={24} color='inherit' /> Loading
								</>
							) : (
								<>
									<Iconify icon='eva:download-outline' /> Download
								</>
							)}
						</MenuItem>
					)}
				</PDFDownloadLink>
			</MenuPopover>
		</>
	);
}
