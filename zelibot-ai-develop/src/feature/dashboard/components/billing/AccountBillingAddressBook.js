import PropTypes from 'prop-types';
// @mui
import { Box, Card, Button, Typography, Stack, Divider } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

AccountBillingAddressBook.propTypes = {
	address: PropTypes.object,
};

export default function AccountBillingAddressBook({ address }) {
	const { push } = useRouter();

	const handleUpdateAddress = () => {
		void push(PATH_DASHBOARD.user.account);
	};

	return (
		<Card sx={{ p: 3, width: '400px' }}>
			<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 3 }}>
				<Typography variant='overline' sx={{ color: 'text.secondary' }}>
					Billing Info
				</Typography>

				<Button size='small' onClick={handleUpdateAddress}>
					Update Address
				</Button>
			</Stack>

			<Stack spacing={3} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
				<Stack spacing={1}>
					<Typography variant='subtitle1'>
						{address?.firstName} {address?.lastName}
					</Typography>
					<Typography variant='body2'>
						<Box component='span' sx={{ color: 'text.secondary', mr: 0.5 }}>
							Address:
						</Box>
						{address?.address ? <>{`${address?.address}, ${address?.city}, ${address?.stateName}, ${address?.postCode} ${address?.country}`}</> : <>Not Provided</>}
					</Typography>

					<Typography variant='body2'>
						<Box component='span' sx={{ color: 'text.secondary', mr: 0.5 }}>
							Email:
						</Box>
						{address?.email}
					</Typography>
					<Typography variant='body2'>
						<Box component='span' sx={{ color: 'text.secondary', mr: 0.5 }}>
							Phone:
						</Box>
						{address?.phoneNumber ? address?.phoneNumber : 'Not Provided'}
					</Typography>
				</Stack>
			</Stack>
		</Card>
	);
}
