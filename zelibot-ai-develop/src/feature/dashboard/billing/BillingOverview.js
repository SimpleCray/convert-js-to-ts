// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../layout';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import { AccountBilling } from '../components/billing';
import { getInvoiceHistory, getUserProfile, getUserBilling } from '../../../constants';
import { APP_NAME } from '../../../config-global';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../auth/context/useAuthContext';
import { Helmet } from 'react-helmet-async';

export default function DashboardBillingOverview() {
	const { enqueueSnackbar } = useSnackbar();
	const { user } = useAuthContext();
	const [invoices, setInvoices] = useState([]);
	const [userData, setUserData] = useState({});
	const [userBilling, setUserBilling] = useState({});

	const handleGetLatestInvoices = async () => {
		await getInvoiceHistory(6)
			.then((response) => {
				response = response === null ? [] : response;
				// sort by date
				response.sort((a, b) => {
					return new Date(b?.invoiceDate) - new Date(a?.invoiceDate);
				});
				setInvoices(response);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching invoices', { variant: 'error' });
			});
	};

	const handleGetInvoiceTo = async () => {
		await getUserProfile()
			.then((response) => {
				setUserData(response?.data[0]);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching invoices', { variant: 'error' });
			});
	};

	const handleGetUserBilling = async () => {
		await getUserBilling()
			.then((response) => {
				setUserBilling(response);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching billing', { variant: 'error' });
			});
	};

	useEffect(() => {
		void handleGetUserBilling();
		void handleGetInvoiceTo();
		void handleGetLatestInvoices();
	}, [setUserBilling, setUserData, setInvoices]);

	return (
		<DashboardLayout>
			<Helmet>
				<title> Billing | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Billing' links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Billing' }]} />

				<AccountBilling userBilling={userBilling} invoices={invoices} userData={userData} user={user} />
			</Container>
		</DashboardLayout>
	);
}
