import PropTypes from 'prop-types';
// @mui
import { Box, Grid, Card, Button, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
//
import AccountBillingAddressBook from './AccountBillingAddressBook';
import AccountBillingPaymentMethod from './AccountBillingPaymentMethod';
import AccountBillingInvoiceHistory from './AccountBillingInvoiceHistory';
import { cancelSubscription, getCancelReasons, invoiceFrom } from '../../../../constants';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

AccountBilling.propTypes = {
	invoices: PropTypes.array,
	userData: PropTypes.object,
	userBilling: PropTypes.object,
};

export default function AccountBilling({ invoices, userData, userBilling, user }) {
	const { push } = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [reasons, setReasons] = useState([]);

	const handleCancelPlanModal = () => {
		setOpen(true);
	};

	const handleUpgradePlan = () => {
		void push(PATH_DASHBOARD.billing.upgrade);
	};

	const planName = userBilling?.pricingModelTitle || user?.pricingModelTitle || '&nbsp;';
	const planCredits = userBilling?.totalCredits === undefined ? 0 + ' Credits' : userBilling?.totalCredits + ' Credits';

	const handleCancelReasons = async () => {
		await getCancelReasons()
			.then((data) => {
				setReasons(data);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error fetching cancel reasons', { variant: 'error' });
			});
	};

	useEffect(() => {
		void handleCancelReasons();
	}, [setReasons]);

	return (
		<>
			<Grid>
				<Grid>
					<Stack spacing={2} direction={'row'}>
						<Card sx={{ p: 3 }}>
							<Typography variant='overline' sx={{ mb: 3, display: 'block', color: 'text.secondary' }}>
								Your Plan
							</Typography>
							<Typography variant='h4' dangerouslySetInnerHTML={{ __html: planName }} />
							<Typography dangerouslySetInnerHTML={{ __html: planCredits }} />
							<Stack
								direction='row'
								spacing={1}
								sx={{
									mt: { xs: 2, sm: 0 },
									position: { sm: 'absolute' },
									top: { sm: 24 },
									right: { sm: 24 },
								}}
							>
								<Button size='small' color='inherit' variant='outlined' onClick={handleCancelPlanModal}>
									Cancel
								</Button>
								{userBilling?.isUpgradeable && (
									<Button size='small' variant='outlined' onClick={handleUpgradePlan}>
										Upgrade plan
									</Button>
								)}
							</Stack>
						</Card>

						{/*<AccountBillingPaymentMethod cards={cards} />*/}

						<AccountBillingAddressBook address={userData} />
					</Stack>
				</Grid>

				<Grid item xs={12} md={4}>
					<AccountBillingInvoiceHistory invoices={invoices} invoiceTo={userData} invoiceFrom={invoiceFrom} />
				</Grid>
			</Grid>
			<CancelPlanDialog open={open} reasons={reasons} onClose={() => setOpen(false)} setOpen={setOpen} />
		</>
	);
}

function CancelPlanDialog({ open, reasons, onClose, setOpen }) {
	const [reasonId, setReasonId] = useState(null);
	const [reasonNotes, setReasonNotes] = useState('');
	const [reason, setReason] = useState({});
	const { enqueueSnackbar } = useSnackbar();

	const onRadioClick = (reason) => {
		setReason(reason);
	};

	const handleCancelSubscription = async (reason) => {
		await cancelSubscription(reason)
			.then((data) => {
				setOpen(false);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error cancelling subscription', { variant: 'error' });
			});
	};

	const handleConfirmCancel = () => {
		// find reason text from reasonId
		const CancelReason = {
			ReasonCategory: reason.ReasonCategory,
			ReasonId: reason.ReasonId,
			ReasonNotes: reasonNotes,
			ReasonText: reason.ReasonText,
		};
		void handleCancelSubscription(CancelReason);
	};

	return (
		<>
			<Dialog open={open} onClose={onClose} scroll={'paper'}>
				<DialogTitle sx={{ pb: 2 }}>Cancel Plan</DialogTitle>

				<DialogContent dividers={true}>
					<DialogContentText sx={{ mb: 1 }}>Please select a reason for cancelling your plan.</DialogContentText>
					<RadioGroup aria-label='reason' name='reason' value={reasonId} margin='normal' onChange={(event) => setReasonId(event.target.value)}>
						{reasons?.map((item) => (
							<FormControlLabel key={item.ReasonId} value={item.ReasonId} control={<Radio />} label={item.ReasonText} onClick={() => onRadioClick(item)} />
						))}
					</RadioGroup>
					<TextField fullWidth label='Additional Info' margin='normal' name='extraReason' variant='outlined' multiline value={reasonNotes} onChange={(event) => setReasonNotes(event.target.value)} />
				</DialogContent>

				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
					<Button variant='contained' onClick={handleConfirmCancel} disabled={reasonId === null}>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
