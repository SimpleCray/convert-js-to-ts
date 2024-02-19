import React, { useEffect, useState } from 'react';
import { Stack, Typography, useTheme, Button } from '@mui/material';
import { getPaymentPlan, invokePayment } from '../../../../constants';
import { useSnackbar } from 'notistack';
import { BillingAddonsContainer, TopUpPackTypography, BackButtonLink } from './BillingAddonStyles';
import TopupCard from '../../components/billing/topup-card/TopUpCard';
import { Loading } from 'src/components/loading-screen';
import Link from '@mui/material/Link';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

export type TopUpPlans = {
	button_text: string;
	credits: number;
	currency: string;
	current_price: number;
	gateway_key: string;
	package_subtitle: string;
	package_title: string;
	pk: string;
	sk: string;
	background_color: string;
	price_footer: string;
};
const BillingAddons: React.FC<{showDashboard: (e: boolean) => {}}> = (props: {showDashboard: (e: boolean) => {}}) => {
	const { showDashboard } = props;
	const { enqueueSnackbar } = useSnackbar();
	const theme = useTheme();

	const [topupPlans, setTopupPlans] = useState<Array<TopUpPlans>>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		void handleGetPaymentPlans();
	}, []);

	const handleGetPaymentPlans = async () => {
		setLoading(true);
		try {
			const response = await getPaymentPlan('LAUNCH_PLAN_TOPUP');
			if (response && response?.plan_details.length > 0) {
				setTopupPlans(response?.plan_details);
				setLoading(false);
			}
		} catch (err) {
			console.error(err);
			enqueueSnackbar('Error getting payment plans');
			setLoading(false);
		}
	};

	const handlePaymentRequest = async (sk: string) => {
		setLoading(true);
		const body = {
			plan: 'LAUNCH_PLAN_TOPUP',
			package: sk,
		};

		await invokePayment(body)
			.then((response) => {
				if (response && response.payment_session) {
					const paymentUrl = response?.payment_session.url;
					const paymentId = response?.payment_session?.id;
					sessionStorage.setItem('topupPayId', paymentId);

					if (paymentUrl) {
						window.location.href = paymentUrl;
					}
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('[24] Something went wrong, please try again later', { variant: 'error' });
				setLoading(false);
			});
	};

	return (
		<BillingAddonsContainer>
			{loading ? (
				<Loading />
			) : (
				<>
					<BackButtonLink underline='none' onClick={() => showDashboard(true)}>
						<ArrowBackRoundedIcon /> Back
					</BackButtonLink>
					<Typography variant='h2' sx={{ color: '#fff', fontWeight: 400 }}>
						Select a Zeli power pack
					</Typography>
					<TopUpPackTypography variant='h6'>Add a top-up pack</TopUpPackTypography>
					<Stack direction={'row'} mt={4} spacing={4}>
						<Typography variant='body1' color={theme.palette.primary.contrastText} sx={{ flexBasis: '25%' }}>
							When you sign up for Zeli, you receive 2500 Zeli credits. If you need additional credits, you can easily purchase top-up bundles that fit your needs.
						</Typography>
						<Stack direction={'row'} spacing={2} flexBasis={'75%'}>
							{topupPlans.map((item, index) => (
								<TopupCard
									key={index}
									topupPlan={item}
									handleTopUp={() => {
										handlePaymentRequest(item.sk);
									}}
								/>
							))}
						</Stack>
					</Stack>
				</>
			)}
		</BillingAddonsContainer>
	);
};

export default BillingAddons;
