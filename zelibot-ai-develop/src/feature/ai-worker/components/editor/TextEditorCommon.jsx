import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFEditor } from '../../../../components/hook-form';
import { Button, CardContent, Typography, CardActions } from '@mui/material';

const composeTextSchema = Yup.object().shape({
	htmlContent: Yup.string().required('Text content is required.'),
});

export const createHtmlContent = (data) => {
	if (!data) return;

	// handle new lines, bolding, and italics
	const htmlContent = data
		.replace(/\n/g, '<br />')
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/g, '<em>$1</em>');

	return htmlContent;
};

/**
 * Renders a common text editor component.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.htmlContent - The HTML content of the editor.
 * @param {Function} props.onSave - The function to be called when the editor content is saved.
 * @return {JSX.Element} The rendered common text editor component.
 */
const TextEditorCommon = ({ htmlContent, onSave, defaultIsEditMode = false, setDefaultIsEditMode, isLoading }) => {
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const handleEditClick = () => {
		setValue('htmlContent', createHtmlContent(htmlContent));
		setDefaultIsEditMode && setDefaultIsEditMode((prevState) => !prevState);
	};

	const defaultValues = {
		htmlContent: createHtmlContent(htmlContent),
	};

	const methods = useForm({
		resolver: yupResolver(composeTextSchema),
		defaultValues,
		// values: {
		// 	htmlContent: createHtmlContent(htmlContent),
		// },
	});

	const {
		setError,
		handleSubmit,
		values,
		formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
		getValues,
		setValue,
		watch,
	} = methods;

	const currentHtmlContent = watch('htmlContent');

	const onSubmit = (data) => {
		onSave(data.htmlContent);
		setIsEditMode(false);
		setDefaultIsEditMode && setDefaultIsEditMode(false);
	};

	const onEditorChange = (isDirty) => {
		setSubmitDisabled(false);
	};

	return (
		<>
			{defaultIsEditMode ? (
				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<CardContent>
						<RHFEditor simple name='htmlContent' onEditorChange={onEditorChange} />
					</CardContent>
					<CardActions sx={{ justifyContent: 'flex-end' }}>
						<Button variant={'outlined'} disabled={isLoading} onClick={handleEditClick}>
							Cancel
						</Button>
						<LoadingButton sx={{backgroundColor: '#21044c', color: 'white'}} type='submit' variant='contained' loading={isLoading} disabled={submitDisabled}>
							Save
						</LoadingButton>
					</CardActions>
				</FormProvider>
			) : (
				// <div sx={{ cursor: 'pointer' }} onClick={() => handleEditClick()} dangerouslySetInnerHTML={{ __html: htmlContent ? htmlContent : '' }}></div>
				<Typography onClick={() => handleEditClick()} variant='body1' component={'div'} sx={{ cursor: 'pointer', '& > *': { marginBlock: 0 } }} dangerouslySetInnerHTML={{ __html: currentHtmlContent ? currentHtmlContent : '' }}></Typography>
			)}
		</>
	);
};

TextEditorCommon.propTypes = {
	htmlContent: PropTypes.string.isRequired,
};

export default TextEditorCommon;
