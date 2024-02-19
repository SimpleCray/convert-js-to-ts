import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField, RHFEditor } from '../../../../../components/hook-form';
import { Button, CardContent, CardHeader, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { LoadingButton } from '@mui/lab';

export default function ComposeTextModal({ id, body, outputCardAction, onClose }) {
	const createHtmlContent = (data) => {
		if (!data) return;

		// handle new lines, bolding, and italics
		const htmlContent = data
			.replace(/\n/g, '<br />')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>');

		return htmlContent;
	};

	const composeTextSchema = Yup.object().shape({
		title: Yup.string(),
		htmlContent: Yup.string().required('Text content is required.'),
	});

	const defaultValues = {
		title: '',
		htmlContent: createHtmlContent(body),
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
			title: data.title?.replace(/\s/g, ''),
			edit_html_content: data.htmlContent,
			edit_text_content: data.htmlContent.replace(/<[^>]+>/g, ''),
		};

		await outputCardAction(id, 'HTML_EDITOR', strippedData);
		await onClose();
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<CardHeader>
				<Typography variant='h5'>Compose Email</Typography>
			</CardHeader>
			<CardContent>
				<RHFTextField name='title' label='Title' helperText={'This is optional.'} />
				<RHFEditor simple name='htmlContent' />
			</CardContent>
			<CardActions>
				<Button onClick={onClose}>Cancel</Button>
				<LoadingButton sx={{backgroundColor: '#21044c', color: 'white'}} type='submit' variant='contained' loading={isSubmitting}>
					Save Changes
				</LoadingButton>
			</CardActions>
		</FormProvider>
	);
}
