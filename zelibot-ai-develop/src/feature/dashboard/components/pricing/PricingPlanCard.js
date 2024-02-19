import PropTypes from 'prop-types';
// @mui
import { Card, Button, Typography, Box, Stack, CircularProgress } from '@mui/material';
// components
import Label from '../../../../components/label';
import { Iconify } from '@zelibot/zeligate-ui';
import { useSnackbar } from 'notistack';
import { getPaymentUrl } from '../../../../constants';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from '../../../../assets/icons';
import { useState } from 'react';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

PricingPlanCard.propTypes = {
	sx: PropTypes.object,
	card: PropTypes.object,
	index: PropTypes.number,
};

export default function PricingPlanCard({ card, index, sx, setLoadingButton, loadingButton, ...other }) {
	const { enqueueSnackbar } = useSnackbar();
	const [loadingIcon, setLoadingIcon] = useState(false);

	const handlePaymentRequest = async (pricingModel) => {
		const cancel_url = window.location.href;
		const success_url = window.location.protocol + '//' + window.location.host + PATH_DASHBOARD.user.account + '?success=true';
		await setLoadingButton(true);
		await setLoadingIcon(true);
		await getPaymentUrl(pricingModel, cancel_url, success_url)
			.then((response) => {
				const paymentUrl = response?.payment_url;
				if (paymentUrl) window.location.href = paymentUrl;
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('[24] Something went wrong, please try again later', { variant: 'error' });
				setLoadingButton(false);
				setLoadingIcon(false);
			});
	};

	return (
		<Card
			sx={{
				p: 5,
				boxShadow: (theme) => theme.customShadows.z24,
				...((index === 0 || index === 2) && {
					boxShadow: 'none',
					bgcolor: 'background.default',
					border: (theme) => `dashed 1px ${theme.palette.divider}`,
				}),
				...sx,
			}}
			{...other}
		>
			{card?.tag && (
				<Label color='primary' sx={{ top: 16, right: 16, position: 'absolute' }}>
					{card?.tag}
				</Label>
			)}

			<Typography variant='overline' sx={{ display: 'block', color: 'text.secondary', mb: 2 }}>
				{card?.pricingModelTitle}
			</Typography>

			{card?.strikeoutPrice && (
				<Box>
					<Typography variant='h5' sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
						{' '}
						${card?.strikeoutPrice}
					</Typography>
				</Box>
			)}

			<Stack spacing={1} direction='row' sx={{ mb: 2 }}>
				{card?.price !== 'Free' && <Typography variant='h5'>$</Typography>}

				<Typography variant='h2'>{card?.price === 'Free' ? 'Free' : card?.price}</Typography>

				{card?.price !== 'Free' && (
					<Typography component='span' sx={{ alignSelf: 'center', color: 'text.secondary' }}>
						{card?.currency}
						<br />/{card?.frequency.toLowerCase() === 'yearly' ? 'month' : 'month'}
					</Typography>
				)}
			</Stack>

			<Typography
				variant='caption'
				sx={{
					color: 'primary.main',
					textTransform: 'capitalize',
				}}
			>
				{card?.pricingDescription}
			</Typography>

			{card?.frequency.toLowerCase() === 'yearly' && (
				<Stack spacing={1} direction='row' sx={{ mb: 0 }}>
					<Typography component='span' sx={{ alignSelf: 'center', color: 'grey.500', fontSize: 'small' }}>
						billed annually
					</Typography>
				</Stack>
			)}

			<Box sx={{ width: 80, height: 80, mt: 4 }}>{(index === 0 && <PlanFreeIcon />) || (index === 1 && <PlanStarterIcon />) || <PlanPremiumIcon />}</Box>

			<Stack component='ul' spacing={2} sx={{ p: 0, my: 4 }}>
				{card?.features?.map((item) => (
					<Stack
						key={item.name}
						component='li'
						direction='row'
						alignItems='center'
						spacing={1}
						sx={{
							typography: 'body2',
							color: item.isAvailable ? 'text.primary' : 'text.disabled',
						}}
					>
						<Iconify
							icon={item.isAvailable ? 'eva:checkmark-fill' : 'eva:close-fill'}
							width={16}
							sx={{
								color: item.isAvailable ? 'primary.main' : 'inherit',
							}}
						/>
						<Typography variant='body2'>{item.name}</Typography>
					</Stack>
				))}
			</Stack>

			<Button fullWidth size='large' variant='contained' disabled={loadingButton} onClick={() => handlePaymentRequest(card?.skPricingModel)}>
				{loadingIcon ? <CircularProgress size={24} color='inherit' /> : card?.buttonText}
			</Button>
		</Card>
	);
}
