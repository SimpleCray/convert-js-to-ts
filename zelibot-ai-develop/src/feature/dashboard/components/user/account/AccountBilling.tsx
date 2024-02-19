import React, { ReactNode, useEffect, useState } from 'react';
import { Container, Stack, Typography, Button, Divider } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { BillingAddons } from 'src/feature/dashboard/billing';
import { BillingOverview } from 'src/feature/dashboard/billing';
import { BillingSubscribe } from 'src/feature/dashboard/billing';
import { getCurrentCredits } from 'src/constants';

const AccountBilling = () => {
	const [subscriptionStatus, setSubscriptionStatus] = useState('');
	const [showDashboard, setShowDashboard] = useState(false);

	useEffect(() => {
		handleGetCurrentCredits();
	}, []);

	const handleGetCurrentCredits = async () => {
		await getCurrentCredits('SUBSCRIPTION')
			.then((response) => {
				setSubscriptionStatus(response?.data?.subscription_status);
			})
			.catch((error) => {
				console.error('error: ', error);
			});
	};

	if (subscriptionStatus === 'active') {
		return <>{showDashboard ? <BillingOverview hideDashboard={async () => setShowDashboard(false)}/> : <BillingAddons showDashboard={async () => setShowDashboard(true)}/>}</>;
	} else {
		return <>
			<BillingSubscribe />
		</>;
	}
};

export default AccountBilling;
