import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { getPaymentPlan, invokePayment } from '../../../../constants';
import { useSnackbar } from 'notistack';
import { BillingSubscribeContainer } from './BillingSubscribeStyles';
import { Loading } from 'src/components/loading-screen';
import SubscribeCard from '../../components/billing/subscribe-card/SubscribeCard';

export type SubscribePlan = {
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
	plan_features: Array<string>;
	package_banner: string;
	price_footer: string;
	strike_price: string;
};
const BillingSubscribe: React.FC<{}> = () => {
	const { enqueueSnackbar } = useSnackbar();

	const [subscribePlans, setSubscribePlans] = useState<SubscribePlan>();
	const [loading, setLoading] = useState<boolean>(false);
	const [pricingModel, setPricingModel] = useState<'STANDARD_YEARLY' | 'STANDARD_MONTHLY'>('STANDARD_YEARLY');
	const [checked, setChecked] = useState<boolean>(true);
	const [btnLoading, setBtnLoading] = useState<boolean>(false);


	useEffect(() => {
		void handleGetPaymentPlans(pricingModel);
	}, [pricingModel]);

	const handleGetPaymentPlans = async (pricingModel: 'STANDARD_YEARLY' | 'STANDARD_MONTHLY') => {
		setLoading(true);
		try {
			const response = await getPaymentPlan('LAUNCH_PLAN_SUBSCRIPTION', pricingModel);
			if (response && response?.plan_details.length > 0) {
				setSubscribePlans(response?.plan_details[0]);
				setLoading(false);
			}
		} catch (err) {
			console.error(err);
			enqueueSnackbar('Error getting payment plans');
			setLoading(false);
		}
	};

	const changePriceModal = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setChecked(checked);
		setPricingModel(checked ? 'STANDARD_YEARLY' : 'STANDARD_MONTHLY');
	};

	const handlePaymentRequest = async () => {
		setBtnLoading(true)
		const body = {
			plan: 'LAUNCH_PLAN_SUBSCRIPTION',
			package: pricingModel,
		};

		await invokePayment(body)
			.then((response) => {
				if (response && response.payment_session) {
					const paymentUrl = response?.payment_session.url;
					const paymentId = response?.payment_session?.id;
					sessionStorage.setItem('subscribePayId', paymentId);

					if (paymentUrl) {
						window.location.href = paymentUrl;
					}
				}
				setBtnLoading(false)
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('[24] Something went wrong, please try again later', { variant: 'error' });
				setBtnLoading(false)
			});
	};

	return (
		<BillingSubscribeContainer>
			{loading ? (
				<Loading />
			) : (
				<>
					<Typography variant='h2' sx={{ color: '#fff', fontWeight: 400 }}>
						Hire Zeli now
					</Typography>

					<Stack direction={'row'} sx={{ marginTop: 3 }} spacing={4}>
						<Typography variant='body1' color={'#fff'} sx={{ flexBasis: '30%' }}>
							Unleash the magic of Zeli and watch your working efficiency really accelerate. Reclaim hours from your day as Zeli helps you get things done, freeing your time for more important things.{' '}
						</Typography>
						<Stack flexBasis={'70%'}>
							<SubscribeCard handlePricingModelChange={changePriceModal} subscription={subscribePlans} priceModel={checked} loading={btnLoading} handleSubscribe={handlePaymentRequest} />
						</Stack>
					</Stack>
				</>
			)}
		</BillingSubscribeContainer>
	);
};

export default BillingSubscribe;
