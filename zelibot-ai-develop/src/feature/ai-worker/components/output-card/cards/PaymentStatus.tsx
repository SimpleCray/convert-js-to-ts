import { Container, Typography, Box, Button, Stack } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

type PaymentProps = {
	onClose: () => void;
	body: { title: string; content: string; btn: string };
	outputCardAction: (id: string | undefined, action: string, body: string) => void
}

export default function PaymentStatus(props: PaymentProps) {
	const { onClose, body, outputCardAction } = props;

	if (body.title === 'SUCCESS') {
		return (
			<Container sx={{ p: 4 }}>
				<Stack direction='column' spacing={1.5} alignItems={'center'}>
					<Typography variant='h5'>Success</Typography>

					<Box>
						<Typography align='center'>Thank you, your payment has been processed.<br/>I'm here to help you save time and enhance your productivity.</Typography>
					</Box>

					<Box>
						<Button variant='contained' color='primary' onClick={onClose}>
							Let's get started
						</Button>
					</Box>
				</Stack>
			</Container>
		);
	} else {
		return (
			<Container sx={{ p: 4, width: '600px' }} >
				<Stack direction='column' spacing={1} alignItems={'center'}>
					<Typography><WarningAmberRoundedIcon fontSize="large" /></Typography>

					<Box>
						<Typography align='center' variant='h4'>Payment not processed</Typography>
					</Box>

					<Stack direction={'row'} spacing={4} mt={1}>
						<Button variant='outlined' color='primary' onClick={() => {
							outputCardAction(undefined, 'SETTINGS', 'billing')
						}}>
							Dismiss
						</Button>
						{"  "}

						<Button variant='contained' color='primary' onClick={() => history.back()}>
							Try again
						</Button>
					</Stack>
				</Stack>
			</Container>
		);
	}
}
