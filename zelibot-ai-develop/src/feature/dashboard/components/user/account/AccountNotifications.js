// form
import {useForm} from 'react-hook-form';
// @mui
import {Alert, Stack} from '@mui/material';
// components
import {useSnackbar} from 'notistack';
import FormProvider, {RHFSwitch} from '../../../../../components/hook-form';
import {getUserProfile, updateProfileFields} from '../../../../../constants';
import {useEffect, useState} from 'react';
import {StyledButton, StyledLoadingButton, StyledTypography} from "./AccountStyles";

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const APPLICATION_OPTIONS = [
	{ value: 'notificationProductUpdates', label: 'Product Updates' },
	{ value: 'notificationWeeklyTips', label: 'Weekly Tips' },
	{ value: 'notificationAnnouncements', label: 'Announcements' },
];

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function AccountNotifications({onClose}) {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(true);

	const defaultValues = {
		notificationProductUpdates: false,
		notificationWeeklyTips: false,
		notificationAnnouncements: false,
	};

	const methods = useForm({
		defaultValues,
	});

	const {
		setValue,
		setError,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = methods;

	const handleProfileNotifications = async () => {
		await getUserProfile()
			.then((response) => {
				setValue('notificationProductUpdates', response.data[0]?.notificationProductUpdates || false);
				setValue('notificationWeeklyTips', response.data[0]?.notificationWeeklyTips || false);
				setValue('notificationAnnouncements', response.data[0]?.notificationAnnouncements || false);
			})
			.catch((error) => {
				console.error('error: ', error);
				enqueueSnackbar('Error loading profile fields', { variant: 'error' });
			}).then(() => setLoading(false));
	};

	useEffect(() => {
		void handleProfileNotifications();
	}, [setValue, setLoading]);

	const onSubmit = async (data) => {
		try {
			await updateProfileFields(data);
			await enqueueSnackbar('Update success!');
		} catch (error) {
			setError('afterSubmit', {
				...error,
				message: error.message || error,
			});
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			{!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
			<Stack gap={5}>
				<StyledTypography>
					Application
				</StyledTypography>

				<Stack alignItems='flex-start' gap={2}>
					{APPLICATION_OPTIONS.map((application) => (
						<RHFSwitch key={application.value} name={application.value} label={application.label} sx={{ m: 0 }} />
					))}
				</Stack>

				<Stack gap={3} direction='row' justifyContent='flex-end'>
					<StyledButton variant='outlined' color='primary' onClick={onClose}>
						Cancel
					</StyledButton>
					<StyledLoadingButton type='submit' variant='contained' color='primary' loading={isSubmitting} disabled={loading}>
						Save
					</StyledLoadingButton>
				</Stack>
			</Stack>
		</FormProvider>
	);
}
