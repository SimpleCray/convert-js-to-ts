import React from 'react';
import { Stack, Typography, Button, Divider, Card } from '@mui/material';
import { Plan, TopUpCard } from './TopUpCardStyles';
import { TopUpPlans } from 'src/feature/dashboard/billing/billing-addon/BillingAddon';

type TopupCardProps = {
	handleTopUp: () => void
	topupPlan: TopUpPlans;
};

const TopupCard = (props: TopupCardProps) => {
	const { handleTopUp, topupPlan } = props;
	return (
		<TopUpCard sx={{ background: topupPlan?.background_color, flexGrow: 1 }}>
			<Stack spacing={1}>
				<Plan>{topupPlan?.package_title}</Plan>

				<div>
					{topupPlan?.package_subtitle}
				</div>

				<Stack direction={'row'} alignItems={'center'}>
					<Typography sx={{ fontSize: '30px' }}>$</Typography>
					<Typography sx={{ fontSize: '48px' }}>{topupPlan?.current_price}</Typography>
				</Stack>

				<div>
					{topupPlan?.price_footer}
				</div>

				<Button variant='contained' color='primary' onClick={handleTopUp}>
					{topupPlan?.button_text}
				</Button>
			</Stack>
		</TopUpCard>
	);
};

export default TopupCard;
