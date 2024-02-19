import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Card, Stack, Paper, Button, Typography } from '@mui/material';
// components
import Image from '../../../../components/image';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

AccountBillingPaymentMethod.propTypes = {
	cards: PropTypes.array,
};

export default function AccountBillingPaymentMethod({ cards }) {
	return (
		<>
			<Card sx={{ p: 3 }}>
				<Stack direction='row' alignItems='center' sx={{ mb: 3 }}>
					<Typography
						variant='overline'
						sx={{
							flexGrow: 1,
							color: 'text.secondary',
						}}
					>
						Payment Method
					</Typography>

					<Button size='small'>Update card</Button>
				</Stack>

				<Stack
					spacing={2}
					direction={{
						xs: 'column',
						md: 'row',
					}}
				>
					{cards.map((card) => (
						<Paper
							key={card.id}
							variant='outlined'
							sx={{
								p: 3,
								width: 1,
								position: 'relative',
							}}
						>
							<Image alt='icon' src={card.cardType === 'master_card' ? '/assets/icons/payments/ic_mastercard.svg' : '/assets/icons/payments/ic_visa.svg'} sx={{ mb: 1, maxWidth: 36 }} />

							<Typography variant='subtitle2'>{card.cardNumber}</Typography>
						</Paper>
					))}
				</Stack>
			</Card>
		</>
	);
}
