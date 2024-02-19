// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../layout';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import InvoiceDetails from '../../components/invoice/details';
import { getInvoice, invoiceFrom, getUserProfile } from '../../../../constants';
import { APP_NAME } from '../../../../config-global';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/hooks/useRouter';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function DashboardBillingInvoiceDetails() {
	const {
		query: { id },
	} = useRouter();

	const [currentInvoice, setCurrentInvoice] = useState(null);
	const [invoiceTo, setInvoiceTo] = useState(null);
	const { enqueueSnackbar } = useSnackbar();

	const handleGetInvoice = async () => {
		await getInvoice(id)
			.then((response) => {
				setCurrentInvoice(response[0]);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching invoice', { variant: 'error' });
			});
	};

	const handleGetInvoiceTo = async () => {
		await getUserProfile()
			.then((response) => {
				setInvoiceTo(response?.data[0]);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching invoice', { variant: 'error' });
			});
	};

	useEffect(() => {
		void handleGetInvoice();
		void handleGetInvoiceTo();
	}, [setCurrentInvoice, setInvoiceTo]);

	return (
		<DashboardLayout>
			<Helmet>
				<title> Billing: Invoice | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs
					heading='Invoice Details'
					links={[
						{ name: 'Dashboard', href: PATH_DASHBOARD.root },
						{
							name: 'Billing',
							href: PATH_DASHBOARD.billing.overview,
						},
						{
							name: 'Invoices',
							href: PATH_DASHBOARD.billing.invoices,
						},
						{ name: currentInvoice?.invoiceNumber },
					]}
				/>

				<InvoiceDetails invoice={currentInvoice} invoiceFrom={invoiceFrom} invoiceTo={invoiceTo} />
			</Container>
		</DashboardLayout>
	);
}
