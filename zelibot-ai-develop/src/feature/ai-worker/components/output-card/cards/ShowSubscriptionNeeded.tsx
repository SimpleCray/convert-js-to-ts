import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { now } from 'lodash';
import { useEffect, useState } from 'react';

type SubscriptionProps = {
	onClose: () => void;
	outputCardAction: (id: string | undefined, action: string, body: string) => void;
	body: { type: string };
};

export default function ShowSubscriptionNeeded(props: SubscriptionProps) {
	const { onClose, outputCardAction, body } = props;

	const [title, setTitle] = useState<string>();
	const [content, setContent] = useState<string>();
	const [btnLabels, setBtnLabels] = useState<{ cancelBtn: string; submitBtn: string }>();

	const TYPE = body.type;

	useEffect(() => {
		if (TYPE === 'CREDITS_OVER') {
			setTitle('Time for a top-up');
			setContent("Hey there! It looks like you've made the most out of your Zeli credits this month. Want more? Simply grab extra credits or wait for your monthly renewal.");
		} else if (TYPE === 'CREDITS_NEARING') {
			setTitle('Nearing Zeli credit limit');
			setContent("You're nearing the limit of your Zeli credits.\nRemember, you can boost your Zeli credits whenever you need.");
		} else if (TYPE === 'SUBSCRIPTION_OVER') {
			setTitle('Time flies');
			setContent('Your Zeli subscription period has wrapped up. To continue using all the great features, simply renew your subscription.');
			setBtnLabels({
				cancelBtn: 'Cancel',
				submitBtn: 'Subscribe now',
			});
		}
	}, []);

	return (
		<Container sx={{ p: 4 }}>
			<Stack direction='column' spacing={1.5} alignItems={'center'}>
				<Typography variant='h5'>{title}</Typography>

				<Box>
					<Typography align='center'>{content}</Typography>
				</Box>

				<Stack direction={'row'} gap={4} m={0.5}>
					<Button variant='outlined' color='primary' onClick={onClose}>
						{btnLabels?.cancelBtn ? btnLabels?.cancelBtn : 'Remind me later'}
					</Button>
					<Button
						variant='contained'
						color='primary'
						onClick={() => {
							outputCardAction(undefined, 'SETTINGS', 'billing');
						}}
					>
						{btnLabels?.submitBtn ? btnLabels?.submitBtn : 'Get more now'}
					</Button>
				</Stack>
			</Stack>
		</Container>
	);
}
