import OutputCard from '../OutputCard';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { Typography, Box, Stepper, Step, StepLabel, Stack } from '@mui/material';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

export default function JobStatusOutputCard({ type, event_id, handleCardClose, ...props }) {
	const steps = ['Permission to proceed with hire', 'Job offer sent', 'Job offer accepted', 'Create employment contract'];

	const closeThiscard = () => {
		handleCardClose(props)
	}

	return (
		<OutputCard title={'Open position status'} chips={false} showButton={false} showActions={true} titleIcon={<FlagOutlinedIcon />} closeCard={closeThiscard} {...props}>
			<Box sx={{ mb: 1 }}>
				<Typography variant={'overline'} color={'text.disabled'}>
					Position Title
				</Typography>
				<Typography variant={'body1'}>Marketing Account Manager</Typography>
			</Box>
			<Box sx={{ mb: 2 }}>
				<Typography variant={'overline'} color={'text.disabled'}>
					Candidate
				</Typography>
				<Typography variant={'body1'}>Anthony Stewart</Typography>
			</Box>
			<Box>
				<Stepper activeStep={2} orientation='vertical'>
					{steps.map((label, index) => (
						<Step key={label} completed={index < 3} sx={{ position: 'relative' }}>
							{index === 2 && (
								<Box
									sx={{
										position: 'absolute',
										width: 8,
										height: 8,
										backgroundColor: 'success.main',
										borderRadius: '50%',
										zIndex: 10,
										bottom: 8,
										left: 18,
									}}
								/>
							)}
							<StepLabel
								sx={{
									'& .MuiStepLabel-label': {
										fontSize: 18,
									},
								}}
							>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper>
			</Box>
			<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack>
		</OutputCard>
	);
}
