// @mui
import { Container, Grid, Button, Stack } from '@mui/material';
// auth
import { useAuthContext } from '../auth/context/useAuthContext';
// sections
import { AppWelcome, AppWidgetSummary } from './components/overview';
// assets
import { getUserBalance, getUserBilling } from '../../constants';
import { APP_NAME } from '../../config-global';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { varFade } from '../../components/animate';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from 'src/feature/dashboard/layout';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function DashboardOverview() {
	const { user } = useAuthContext();
	const { enqueueSnackbar } = useSnackbar();
	const [balance, setBalance] = useState(0);
	const [balanceLoading, setBalanceLoading] = useState(true);
	const [plan, setPlan] = useState(0);
	const [planLoading, setPlanLoading] = useState(true);

	const handleUserBalance = async () => {
		await getUserBalance()
			.then((res) => {
				const creditLimit = res?.CreditLimit || 0;
				const balance = res?.Balance || 0;
				setBalance({ CreditLimit: creditLimit, Balance: balance });
				setBalanceLoading(false);
			})
			.catch((err) => {
				// console.log('error: ', err);
				enqueueSnackbar('Sorry, we are unable to retrieve the credits right now. Please try again later.', { variant: 'error' });
				setBalanceLoading(false);
			});
	};

	const handleGetUserPlan = async () => {
		await getUserBilling()
			.then((response) => {
				const planName = response?.pricingModelTitle || user?.pricingModelTitle || 'Free Tier';
				const planCredits = response?.totalCredits === undefined ? 0 + ' Credits' : response?.totalCredits + ' Credits';
				setPlan({ name: planName, credits: planCredits });
				setPlanLoading(false);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Sorry, we are unable to retrieve the plan right now. Please try again later.', { variant: 'error' });
				setPlanLoading(false);
			});
	};

	useEffect(() => {
		void handleGetUserPlan();
		void handleUserBalance();
	}, [setBalance, setBalanceLoading, setPlan, setPlanLoading]);

	return (
		<DashboardLayout>
			<Helmet>
				<title> Dashboard | {APP_NAME}</title>
			</Helmet>

			<Container>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Stack component={m.div} variants={varFade().inUp} alignItems='center'>
							<AppWelcome
								title={`Hi welcome to Zeligate`}
								description={'Our assistants are ready to help you achieve greatness today'}
								action={
									<Button variant='contained' href={PATH_DASHBOARD.hrHelper.root}>
										Try the HR Helper
									</Button>
								}
							/>
						</Stack>
					</Grid>

					<Grid item xs={12} md={6}>
						<AppWidgetSummary
							title='Your Usage'
							// total={balance?.CreditLimit}
							total={'Unlimited'}
							// current={balance?.Balance}
							subtitle={''}
							chart={{
								series: balance?.Balance ? ((balance?.Balance / balance?.CreditLimit) * 100).toFixed(0) : 0,
							}}
							chartType={'radialBar'}
							buttonText={'View Credits'}
							// buttonLink={PATH_DASHBOARD.billing.overview}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<AppWidgetSummary
							title='Your Plan'
							total={plan?.name}
							// subtitle={plan?.credits}
							enableChart={false}
							buttonText={'Upgrade Plan'}
							// buttonLink={PATH_DASHBOARD.billing.upgrade}
						/>
					</Grid>
				</Grid>
			</Container>
		</DashboardLayout>
	);
}
