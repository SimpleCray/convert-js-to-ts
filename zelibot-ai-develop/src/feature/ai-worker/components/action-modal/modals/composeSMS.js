import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFEditor } from '../../../../../components/hook-form';
import { Button, CardContent, CardHeader, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { LoadingButton } from '@mui/lab';

export default function ComposeSmsModal({ id, body, outputCardAction, onClose }) {
	const createSmsContent = (data) => {
		if (!data) return;

		// first 300 characters
		const smsContent = data.replace(/<[^>]+>/g, '').substring(0, 300);

		return smsContent;
	};

	const composeTextSchema = Yup.object().shape({
		to: Yup.string(),
		smsContent: Yup.string().max(300, 'SMS content cannot exceed 300 characters.').required('SMS content is required.'),
	});

	const defaultValues = {
		to: '',
		smsContent: createSmsContent(body),
	};

	const methods = useForm({
		resolver: yupResolver(composeTextSchema),
		defaultValues,
	});

	const {
		setError,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = methods;

	const onSubmit = async (data) => {
		const strippedData = {
			to: data.to?.replace(/\s/g, ''),
			sms_content: data.smsContent,
		};

		await outputCardAction(id, 'SEND_SMS', strippedData);
		await onClose();
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<CardHeader>
				<Typography variant='h5'>Compose SMS</Typography>
			</CardHeader>
			<CardContent>
				<RHFTextField name='to' label='To' type={'number'} helperText={'This is optional.'} />
				<RHFEditor simple name='smsContent' />
			</CardContent>
			<CardActions>
				<Button onClick={onClose}>Cancel</Button>
				<LoadingButton type='submit' variant='contained' loading={isSubmitting}>
					Send SMS
				</LoadingButton>
			</CardActions>
		</FormProvider>
	);
}
