import React from 'react';
import { Stack, Typography, Button, Switch, Box } from '@mui/material';
import { SubscribeCardContainer, DiscountTypography, StrikeTypography, PriceTypography } from './SubscribeCardStyles';
import { SubscribePlan } from 'src/feature/dashboard/billing/billing-subscribe/BillingSubscribe';
import { LoadingButton } from '@mui/lab';

type SubscribeCardProps = {
	handlePricingModelChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
	handleSubscribe: () => void;
	priceModel: boolean;
	subscription: SubscribePlan | undefined;
	loading?: boolean;
};

const SubscribeCard = (props: SubscribeCardProps) => {
	const { handlePricingModelChange, handleSubscribe, priceModel, subscription, loading = false } = props;

	return (
		<SubscribeCardContainer>
			<Stack spacing={2}>
				{subscription?.package_banner && <DiscountTypography variant='h4'>{subscription?.package_banner}</DiscountTypography>}
				<Stack color={'#fff'} direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'end'}>
					<Box>
						<Typography variant='h4'>{subscription?.package_title}</Typography>
						<br />
						<Typography variant='body1'>{subscription?.package_subtitle}</Typography>
					</Box>

					<Box>
						<PriceTypography>
							{subscription?.strike_price && <StrikeTypography>${subscription?.strike_price}</StrikeTypography>}
							${subscription?.current_price}
						</PriceTypography>
						<Typography>{subscription?.price_footer}</Typography>
					</Box>
				</Stack>

				<Box color={'#fff'}>
					{subscription?.plan_features &&
						subscription?.plan_features.map((item: string, i: number) => (
							<Stack key={i}>
								<li>{item}</li>
							</Stack>
						))}
				</Box>

				<Stack direction={'row'} justifyContent={'space-between'}>
					<Stack direction='row' alignItems='center' justifyContent='center'>
						<Typography variant='body2' color={!priceModel ? '#fff' : '#C492F4'} fontWeight={'700'}>
							Pay Monthly
						</Typography>

						<Switch checked={priceModel} onChange={handlePricingModelChange} />
						<Typography variant='body2' color={priceModel ? '#fff' : '#C492F4'} fontWeight={'700'}>
							Yearly Discount
						</Typography>
					</Stack>
					<LoadingButton variant='contained' color='primary' loading={loading} onClick={handleSubscribe}>
						{subscription?.button_text}
					</LoadingButton>
				</Stack>
			</Stack>
		</SubscribeCardContainer>
	);
};

export default SubscribeCard;
