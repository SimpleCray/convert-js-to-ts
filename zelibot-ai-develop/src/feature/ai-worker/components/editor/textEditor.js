import * as Yup from 'yup';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Button, CardContent} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import {LoadingButton} from '@mui/lab';
import FormProvider, {RHFEditor} from '../../../../components/hook-form';

export const TextEditor = ({ body, onClose, setContent }) => {
	const stripData = (data) => {
		// return data.replace(/<[^>]+>/g, '');
		return data
			.replace(/<p\b[^>]*>/g, '<span>')
			.replace(/<\/p>/g, '</span><br>')
			.replace(/<span><br><\/span>/g, '')
			.replace(/<br(\s)*(\/)?>/g, '\n')
			.replace(/<[^>]+>/g, '')
			.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/<em>(.*?)<\/em>/g, '*$1*')
			.trim();
	};

	const composeTextSchema = Yup.object().shape({
		htmlContent: Yup.string().required('Text content is required.'),
	});

	const methods = useForm({
		resolver: yupResolver(composeTextSchema),
		defaultValues: {
			htmlContent: body,
		},
		values: {
			htmlContent: body,
		},
	});

	const {
		handleSubmit,
		values,
		formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
		getValues,
		setValue,
	} = methods;

	const onSubmit = async (data) => {
		if (isMatching(body, data.htmlContent)) {
			return onClose();
		}

		await setContent(data.htmlContent);
	};

	const isMatching = (init, content) => {
		if (!init && !content) {
			return true;
		}

		const data1 = stripData(init);
		const data2 = stripData(content);
		return data1 === data2;
	};

	const [submitDisabled, setSubmitDisabled] = useState(true);

	const onEditorChange = (isDirty) => {
		setSubmitDisabled(isMatching(body, getValues().htmlContent));
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<CardContent>
				<RHFEditor simple name='htmlContent' onEditorChange={onEditorChange} />
			</CardContent>
			<CardActions sx={{ justifyContent: 'flex-end' }}>
				<Button variant={'outlined'} onClick={onClose}>Cancel</Button>
				<LoadingButton sx={{backgroundColor: '#21044c', color: 'white'}} type='submit' variant='contained' disabled={submitDisabled} loading={isSubmitting}>
					Save
				</LoadingButton>
			</CardActions>
		</FormProvider>
	);
};

export default TextEditor;
