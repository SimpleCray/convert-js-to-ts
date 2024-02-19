// @mui
import { Box, Container, Stack, Switch, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../layout';
// components
import { getPricingPlans } from '../../../constants';
import { APP_NAME } from '../../../config-global';
import { PATH_DASHBOARD } from '../../../routes/paths';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PricingPlanCard } from '../components/pricing';
import { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function DashboardBillingUpgrade() {
	const { enqueueSnackbar } = useSnackbar();
	const [pricingPlans, setPricingPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pricingModel, setPricingModel] = useState('YEARLY');
	const [loadingButton, setLoadingButton] = useState(false);

	const handleGetPricingPlans = useCallback(
		async (pricingModel) => {
			await getPricingPlans(pricingModel)
				.then((response) => {
					setPricingPlans(response);
					setLoading(false);
				})
				.catch((error) => {
					console.error('error: ', error);
				});
		},
		[pricingModel, enqueueSnackbar]
	);

	useEffect(() => {
		void handleGetPricingPlans(pricingModel);
	}, [setPricingPlans, setLoading]);

	const handlePricingModelChange = (event) => {
		setPricingModel(event.target.checked ? 'YEARLY' : 'MONTHLY');
		void handleGetPricingPlans(event.target.checked ? 'YEARLY' : 'MONTHLY');
	};

	return (
		<DashboardLayout>
			<Helmet>
				<title> Billing: Upgrade | {APP_NAME}</title>
			</Helmet>

			<Container>
				<CustomBreadcrumbs heading='Upgrade' links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Billing', href: PATH_DASHBOARD.billing.overview }, { name: 'Upgrade' }]} />

				{!loading ? (
					<>
						<Box sx={{ my: 5 }}>
							<Stack direction='row' alignItems='center' justifyContent='center'>
								<Typography variant='overline' sx={{ mr: 1.5 }}>
									MONTHLY
								</Typography>

								<Switch checked={pricingModel === 'YEARLY'} onChange={handlePricingModelChange} />
								<Typography variant='overline' sx={{ ml: 1.5 }}>
									YEARLY (save 20%)
								</Typography>
							</Stack>

							<Typography variant='caption' align='center' sx={{ color: 'text.secondary', display: 'block' }}>
								* Cancel at any time and keep all your credits
							</Typography>
						</Box>

						<Box gap={3} display='grid' gridTemplateColumns={{ md: 'repeat(3, 1fr)' }}>
							{pricingPlans?.length > 0 &&
								pricingPlans
									?.filter((plan) => plan.isAvailable)
									.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
									.map((card, index) => <PricingPlanCard key={index} card={card} index={index} loadingButton={loadingButton} setLoadingButton={setLoadingButton} />)}
						</Box>
					</>
				) : null}
			</Container>
		</DashboardLayout>
	);
}
