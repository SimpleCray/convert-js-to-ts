import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFEditor } from '../../../../../components/hook-form';
import { Button, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { LoadingButton } from '@mui/lab';
import { createHtmlFromText } from '../../../helpers/createHtmlFromText';

export default function ComposeEmailModal({ id, body, outputCardAction, onClose }) {
	const composeEmailSchema = Yup.object().shape({
		emailTo: Yup.string().email('Invalid email address.'),
		emailCc: Yup.string().email('Invalid email address.'),
		emailSubject: Yup.string(),
		emailHtmlContent: Yup.string().required('Email content is required.'),
	});

	const defaultValues = {
		emailTo: '',
		emailCc: '',
		emailSubject: '',
		emailHtmlContent: createHtmlFromText(body ?? ''),
	};

	const methods = useForm({
		resolver: yupResolver(composeEmailSchema),
		defaultValues,
	});

	const {
		setError,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = methods;

	const onSubmit = async (data) => {
		const strippedData = {
			email_to: data.emailTo?.replace(/\s/g, ''),
			email_cc: data.emailCc?.replace(/\s/g, ''),
			email_subject: data.emailSubject?.replace(/\s/g, ''),
			email_html_content: data.emailHtmlContent,
			email_text_content: data.emailHtmlContent.replace(/<[^>]+>/g, ''),
		};

		await outputCardAction(id, 'SEND_EMAIL', strippedData);
		await onClose();
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<CardHeader>
				<Typography variant='h5'>Compose Email</Typography>
			</CardHeader>
			<CardContent>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<RHFTextField name='emailTo' label='To' helperText={'Separate multiple emails with commas. This is optional.'} />
					</Grid>
					<Grid item xs={6}>
						<RHFTextField name='emailCc' label='Cc' helperText={'Separate multiple emails with commas. This is optional.'} />
					</Grid>
				</Grid>
				<RHFTextField name='emailSubject' label='Subject' helperText={'This is optional.'} />
				<RHFEditor simple name='emailHtmlContent' />
			</CardContent>
			<CardActions>
				<Button onClick={onClose}>Cancel</Button>
				<LoadingButton type='submit' variant='contained' loading={isSubmitting}>
					Send Email
				</LoadingButton>
			</CardActions>
		</FormProvider>
	);
}
