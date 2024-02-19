import { Typography, Stack } from '@mui/material';
import OutputCard from '../OutputCard';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

export default function FeatureNotAvailableOutputCard({ type, event_id, handleCardClose, ...props }) {

	const closeThiscard = () => {
		handleCardClose(props)
	}

	return (
		<OutputCard title={'Feature not available'} titleIcon={<PriorityHighIcon />} closeCard={closeThiscard} {...props}>
			<Typography variant='body1' component={'div'} sx={{ mb: 2 }} textAlign={'center'}>
				We are striving to deliver this feature shortly.
				<br />
				We are currently in the process of perfecting its execution.
			</Typography>
			<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack>
		</OutputCard>
	);
}
