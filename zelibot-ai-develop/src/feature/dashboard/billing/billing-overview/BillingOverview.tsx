import React, { useEffect, useState } from 'react';
import BillingInfo from '../../components/billing/BillingInfo';
import { Container, Stack, Typography, Button, Box, Divider } from '@mui/material';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import { getInvoices, getCurrentSubscription, getCurrentCredits, getPaymentInfo, getPurchaseHistory } from '../../../../constants';
import { useSnackbar } from 'notistack';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { BoldHeader, DataGridStyles, SectionTypography, SubHeading, CardType, PurchaseHistoryCont } from './BillingOverviewStyles';
import moment from 'moment';
import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded';
import { downloadFileFromUrl } from 'src/utils/file';
import Loading from 'src/components/loading-screen/Loading';
import { convertTimestampToLocalDateString as toLocale } from 'src/utils/formatTime';
import { Credit, Subscription, Card, Billing, PurchaseHistory } from '../../types/billing';

const columns: GridColDef[] = [
	{
		field: 'created',
		headerName: 'Date',
		type: 'string',
		valueGetter: (params) => {
			if (params) {
				return moment(toLocale(params.value) as string).format('Do MMMM YYYY');
			}
		},
		width: 150,
	},
	{
		field: `number`,
		headerName: 'Number',
		width: 150,
	},
	{
		field: 'amount_paid',
		headerName: 'Amount',
		valueGetter: (params) => {
			if (params) {
				return `$${params.value / 100}`;
			}
		},
		width: 100,
	},

	{
		field: 'invoice_pdf',
		headerName: 'Download',
		renderCell: (params) => (
			<>
				<Button size='small' aria-label='download' sx={{ color: '#9859E0', borderRadius: '3333px', minWidth: 'auto', p: 1 }} onClick={() => downloadFileFromUrl(params.value)}>
					<SaveAltRoundedIcon color='inherit' />
				</Button>
			</>
		),
		align: 'center',
	},
];

const BillingOverview: React.FC<{ hideDashboard: any }> = (props: { hideDashboard: any }) => {
	const { hideDashboard } = props;
	const { enqueueSnackbar } = useSnackbar();
	const [invoices, setInvoices] = useState([]);
	const [planDetails, setPlanDetails] = useState<Subscription>();
	const [loading, setLoading] = useState<boolean>(false);
	const [subscriptionEndTime, setSubscriptionEndTime] = useState<string>('');
	const [daysPending, setDaysPending] = useState<string>('');
	const [creditsPending, setCreditsPending] = useState<number | string>('');
	const [payInfo, setPayInfo] = useState<Card>();
	const [billingInfo, setBillingInfo] = useState<Billing>();
	const [creditsInfo, setCreditsInfo] = useState<Credit>();
	const [purchaseHistory, setPurchaseHistory] = useState<Array<PurchaseHistory>>();

	useEffect(() => {
		void handleGetCurrentCredits();
		void handleGetLatestInvoices();
		void handleGetCurrentSubscription();
		void handleGetPaymentInfo();
		void fetchPurchaseHistory();
	}, []);

	const handleGetCurrentCredits = async () => {
		await getCurrentCredits('BALANCE')
			.then((response) => {
				setCreditsInfo(response?.data);
				setCreditsPending(Number(response?.data?.credit_limit) - Number(response?.data?.credit_usage))
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching billing', { variant: 'error' });
			});
	};

	const handleGetCurrentSubscription = async () => {
		await getCurrentSubscription()
			.then((response) => {
				if (response) {
					setPlanDetails(response?.subscription_details?.plan_details);

					const endTime = response?.subscription_details.current_period_end;
					const convertToLocale = toLocale(endTime) as string;

					setSubscriptionEndTime(moment(convertToLocale).format('Do MMMM YYYY'));
					setDaysPending(moment(convertToLocale).startOf('day').fromNow());
				}
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching subscription', { variant: 'error' });
			});
	};

	const handleGetPaymentInfo = async () => {
		setLoading(true);
		await getPaymentInfo()
			.then((response) => {
				if (response) {
					setPayInfo(response.payment_list?.data[0].card);
					setBillingInfo(response.payment_list?.data[0].billing_details);
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching subscription', { variant: 'error' });
				setLoading(false);
			});
	};

	const handleGetLatestInvoices = async () => {
		setLoading(true);
		await getInvoices()
			.then((resp) => {
				const response = resp === null ? [] : resp.invoice_list.data;
				setInvoices(response);
				setLoading(false);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching invoices', { variant: 'error' });
				setLoading(false);
			});
	};

	const fetchPurchaseHistory = async () => {
		setLoading(true);
		await getPurchaseHistory()
			.then((resp) => {
				if (resp) {
					setPurchaseHistory(resp?.data);
				}
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching purchasing history', { variant: 'error' });
				setLoading(false);
			});
	};

	return (
		<Stack direction={'column'} spacing={4}>
			{loading && (
				<Box sx={{ height: 500 }}>
					<Loading />
				</Box>
			)}

			{!loading && (
				<>
					<Stack direction={'row'}>
						<BillingInfo
							heading={'Current Plan'}
							btnLabel={''}
							body={
								<>
									<SubHeading>
										{planDetails?.package_banner} ${planDetails?.current_price}
									</SubHeading>

									<Stack>
										<BoldHeader>Subscription renewal date</BoldHeader>

										<Typography variant='body2'>
											{subscriptionEndTime} ({daysPending})
										</Typography>
									</Stack>

									<Stack>
										<BoldHeader>What you’ll be charged</BoldHeader>

										<Typography variant='body2'>
											{planDetails?.currency} ${planDetails?.current_price} {planDetails?.price_footer} (excluding tax)
										</Typography>
									</Stack>
								</>
							}
						/>

						<BillingInfo
							heading={'Billing Address'}
							btnLabel={''}
							body={
								<>
									<SubHeading>{billingInfo?.name}</SubHeading>
									{billingInfo?.email && <BoldHeader>{billingInfo?.email}</BoldHeader>}

									{billingInfo?.phone && <BoldHeader>{billingInfo?.phone}</BoldHeader>}
								</>
							}
						/>

						<BillingInfo
							heading={'Payment'}
							btnLabel={''}
							body={
								<>
									<BoldHeader> Credit Card Details</BoldHeader>
									<Stack direction={'row'} justifyContent={'space-between'}>
										<CardType>{payInfo?.brand.toLocaleUpperCase()}</CardType>
										<Typography>**** **** **** {payInfo?.last4}</Typography>
									</Stack>
								</>
							}
						/>
					</Stack>

					<Stack direction={'row'}>
						<>
							<BillingInfo
								sx={{ flexBasis: '50%' }}
								heading={'Zeli credits'}
								btnLabel={'Add more'}
								endIcon={<ShoppingBasketOutlinedIcon />}
								onClick={() => hideDashboard(false)}
								body={
									<>
										<PurchaseHistoryCont>
											{purchaseHistory?.map((item, index) => (
												<Stack direction={'row'} justifyContent={'space-between'} key={index}>
													<BoldHeader>{item.description}</BoldHeader>
													<BoldHeader>{item.credit_balance}</BoldHeader>
												</Stack>
											))}
											<Stack direction={'row'} justifyContent={'space-between'}>
												<BoldHeader>Total Credits</BoldHeader>
												<BoldHeader>{creditsInfo?.credit_limit}</BoldHeader>
											</Stack>
										</PurchaseHistoryCont>

										<Stack direction={'row'} justifyContent={'space-between'}>
											<BoldHeader>Available Balance:</BoldHeader>
											<BoldHeader>{creditsPending ? creditsPending : '0'}</BoldHeader>
										</Stack>
									</>
								}
							/>
						</>

						<Box sx={{ height: 300, width: '100%' }}>
							<SectionTypography>Invoices</SectionTypography>
							<br />

							<DataGrid rows={invoices} columns={columns} sx={DataGridStyles} headerHeight={36} disableSelectionOnClick hideFooterPagination={true} />
						</Box>
					</Stack>
				</>
			)}
		</Stack>
	);
};

export default BillingOverview;
