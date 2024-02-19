import { useEffect, useState } from 'react';
// @mui
import { Card, Table, TableBody, Container, TableContainer } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fTimestamp } from '../../../../utils/formatTime';
// layouts
import DashboardLayout from '../../layout';
// components
import Scrollbar from '../../../../components/scrollbar';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useTable, getComparator, emptyRows, TableNoData, TableEmptyRows, TableHeadCustom, TablePaginationCustom } from '../../../../components/table';
// sections
import { InvoiceTableRow, InvoiceTableToolbar } from '../../components/invoice/list';
import { invoiceFrom, getInvoiceHistory, getUserProfile } from '../../../../constants';
import { APP_NAME } from '../../../../config-global';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useRouter } from 'src/hooks/useRouter';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'invoiceId', label: 'Invoice', align: 'left', width: 500, sort: true },
	{ id: 'invoicePaymentAmount', label: 'Amount', align: 'right', sort: true },
	{ id: 'status', label: 'Status', align: 'right', sort: true },
	{ id: 'invoiceDate', label: 'Date', align: 'right', sort: true },
	{ id: '' },
];

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function DashboardBillingInvoiceList() {
	const { push } = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const {
		dense,
		page,
		order,
		orderBy,
		rowsPerPage,
		setPage,
		//
		onSort,
		setOrderBy,
		onChangePage,
		onChangeRowsPerPage,
	} = useTable({ defaultOrderBy: 'invoiceDate', defaultOrder: 'asc' });

	const [tableData, setTableData] = useState([]);
	const [filterName, setFilterName] = useState('');
	const [filterDate, setFilterDate] = useState(null);
	const [invoiceTo, setInvoiceTo] = useState(null);
	const [loading, setLoading] = useState(true);
	const dataFiltered = applyFilter({
		inputData: tableData,
		comparator: getComparator(order, orderBy),
		filterName,
		filterDate,
	});
	const denseHeight = dense ? 56 : 76;
	const isFiltered = filterName !== '' || !!filterDate;

	const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterDate) || dataFiltered.length === 0;

	const handleFilterName = (event) => {
		setPage(0);
		setFilterName(event.target.value);
	};

	const handleResetFilter = () => {
		setFilterName('');
		setFilterDate(null);
	};

	const handleViewRow = (id) => {
		void push(PATH_DASHBOARD.billing.view(id));
	};

	const handleGetInvoiceHistory = async () => {
		await getInvoiceHistory()
			.then((response) => {
				setTableData(response === null ? [] : response);
				setLoading(false);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching invoices', { variant: 'error' });
			});
	};

	const handleGetInvoiceTo = async () => {
		await getUserProfile()
			.then((response) => {
				setInvoiceTo(response?.data[0]);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching invoices', { variant: 'error' });
			});
	};

	useEffect(() => {
		void handleGetInvoiceTo();
		void handleGetInvoiceHistory();
	}, [setTableData, setInvoiceTo, setLoading]);

	return (
		<Container sx={{ height: '500px', overflow: 'auto'}}>
			<Helmet>
				<title> Billing: Invoices | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs
					heading='Invoices'
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Billing',
							href: PATH_DASHBOARD.billing.overview,
						},
						{
							name: 'Invoices',
						},
					]}
				/>

				<Card>
					<InvoiceTableToolbar
						isFiltered={isFiltered}
						filterName={filterName}
						filterDate={filterDate}
						onFilterName={handleFilterName}
						onResetFilter={handleResetFilter}
						onFilterDate={(newValue) => {
							setFilterDate(newValue);
						}}
					/>

					<TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
						<Scrollbar>
							<Table>
								<TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} rowCount={tableData.length} onSort={onSort} />

								<TableBody>
									{dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
										<InvoiceTableRow key={row.invoiceId} row={row} invoiceFrom={invoiceFrom} invoiceTo={invoiceTo} onSelectRow={() => onSelectRow(row.invoiceId)} onViewRow={() => handleViewRow(row.invoiceId)} />
									))}

									<TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

									<TableNoData isNotFound={isNotFound || loading} />
								</TableBody>
							</Table>
						</Scrollbar>
					</TableContainer>

					<TablePaginationCustom count={dataFiltered.length} page={page} rowsPerPage={rowsPerPage} onPageChange={onChangePage} onRowsPerPageChange={onChangeRowsPerPage} />
				</Card>
			</Container>
		</Container>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterDate }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterName) {
		inputData = inputData.filter((invoice) => invoice.invoiceId.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
	}

	if (filterDate) {
		inputData = inputData.filter((invoice) => fTimestamp(invoice.invoiceDate) <= fTimestamp(filterDate));
	}

	return inputData;
}
