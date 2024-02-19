import { Stack, styled, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Text14MidnightPurpleWeight400, Text22MidnightPurpleWeight400 } from '../../../../components/common/TypographyStyled';
import { useState, useMemo } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../../../components/hook-form/FormProvider';
import { RHFTextField } from '../../../../components/hook-form';
import { CTA_FLOW } from '../cta-section/CTASection';
import { useGetSurveyQuestions, useSendSurveyAnswer } from '../../../../hooks/SurveyQuestion/useSurveyQuestion';
import { Loading } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledRHFTextField = styled(RHFTextField)(({ theme }) => ({
	'& .MuiInputBase-root': {
		color: '#21054C',
		height: '100%',
		width: 212,
	},
}));

const FIELD = ['Marketing', 'Legal', 'Real estate', 'Admin', 'Finance', 'Social Media', 'Sales'];

const UncheckIcon = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none'>
		<path d='M15 2.5C8.0875 2.5 2.5 8.0875 2.5 15C2.5 21.9125 8.0875 27.5 15 27.5C21.9125 27.5 27.5 21.9125 27.5 15C27.5 8.0875 21.9125 2.5 15 2.5ZM15 25C9.475 25 5 20.525 5 15C5 9.475 9.475 5 15 5C20.525 5 25 9.475 25 15C25 20.525 20.525 25 15 25Z' fill='#3B0099' />
	</svg>
);

const CheckIcon = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none'>
		<path
			d='M26.6136 7.36275L14.1136 19.8628C13.6261 20.3503 12.8386 20.3503 12.3511 19.8628L8.81363 16.3253C8.32613 15.8378 8.32613 15.0503 8.81363 14.5628C9.30113 14.0753 10.0886 14.0753 10.5761 14.5628L13.2261 17.2128L24.8386 5.60025C25.3261 5.11275 26.1136 5.11275 26.6011 5.60025C27.1011 6.08775 27.1011 6.87525 26.6136 7.36275ZM19.7136 3.42525C17.6011 2.56275 15.2011 2.26275 12.7011 2.71275C7.61363 3.62525 3.55113 7.72525 2.68863 12.8128C1.26363 21.2503 8.28863 28.4753 16.6761 27.3878C21.6261 26.7503 25.7761 23.0628 27.0761 18.2503C27.5761 16.4128 27.6261 14.6378 27.3386 12.9753C27.1761 11.9753 25.9386 11.5878 25.2136 12.3003C24.9261 12.5878 24.8011 13.0128 24.8761 13.4128C25.1511 15.0753 25.0261 16.8503 24.2261 18.7378C22.7761 22.1253 19.6261 24.6128 15.9636 24.9503C9.58863 25.5378 4.30113 20.1378 5.08863 13.7253C5.62613 9.30025 9.18863 5.70025 13.6011 5.08775C15.7636 4.78775 17.8136 5.20025 19.5636 6.10025C20.0511 6.35025 20.6386 6.26275 21.0261 5.87525C21.6261 5.27525 21.4761 4.26275 20.7261 3.87525C20.3886 3.72525 20.0511 3.56275 19.7136 3.42525Z'
			fill='#3B0099'
		/>
	</svg>
);

const schema = Yup.object().shape({
	other: Yup.string(),
});

const SURVEY_QUESTION_ID = process.env['SURVEY_ID'] || '';

export default function SelectZeliForm({ setForm, email }) {
	const [fieldsSet, setFieldsSet] = useState(new Set());
	const { data, isPending: isPendingGetData } = useGetSurveyQuestions({ survey_id: SURVEY_QUESTION_ID });
	const { mutate: mutateSendSurveyAnswer, isPending: isPendingSendSurvey } = useSendSurveyAnswer({});
	const methods = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			other: '',
		},
	});

	const { watch, handleSubmit } = methods;
	const otherValue = watch('other');

	const onToggleField = (field) => {
		if (fieldsSet.has(field)) {
			fieldsSet.delete(field);
			setFieldsSet(new Set(fieldsSet));
		} else {
			setFieldsSet(new Set(fieldsSet.add(field)));
		}
	};

	const listField = useMemo(() => {
		const newSet = new Set(fieldsSet);
		if (otherValue?.trim()) {
			newSet.add(otherValue);
		}
		return newSet;
	}, [fieldsSet, otherValue]);

	const disabled = useMemo(() => listField.size === 0, [listField]);

	const onSubmit = () => {
		mutateSendSurveyAnswer(
			{
				survey_question_id: data?.survey_question_id || '',
				user_email: email,
				survey_answer_id: [...fieldsSet],
				survey_answer_text: otherValue,
			},
			{
				onSuccess: () => {
					setForm(CTA_FLOW.COMPLETE);
				},
			}
		);
	};

	const OPTIONS = useMemo(() => {
		const options = data?.survey_answer_options?.map(({ answer_id, answer_text }) => ({
			label: answer_text,
			value: answer_id,
		}));
		return options || [];
	}, [data?.survey_answer_options]);

	if (isPendingGetData) {
		return (
			<Box p={10} sx={{ position: 'relative' }}>
				<Loading />
			</Box>
		);
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack gap={1}>
				<Text22MidnightPurpleWeight400 gutterBottom>{data?.survey_question}</Text22MidnightPurpleWeight400>
				<Stack direction='row' flexWrap='wrap' gap={{ xs: 2, md: 5 }} justifyContent='space-between'>
					<Stack direction='row' alignItems='center' gap={3} flexWrap='wrap' sx={{ maxWidth: 600 }}>
						{OPTIONS.map(({ label, value }, index) => (
							<Stack sx={{ cursor: 'pointer' }} key={`${label}_${index}`} direction='row' gap={1} alignItems='center' onClick={() => onToggleField(value)}>
								<Text14MidnightPurpleWeight400>{label}</Text14MidnightPurpleWeight400>
								{fieldsSet.has(value) ? <CheckIcon /> : <UncheckIcon />}
							</Stack>
						))}
						<Stack direction='row' gap={1} alignItems='center'>
							<Text14MidnightPurpleWeight400>Other</Text14MidnightPurpleWeight400>
							<StyledRHFTextField name='other' variant='standard' sx={{ maxWidth: 212 }} autoComplete='new-password' />
						</Stack>
					</Stack>
					<LoadingButton disabled={disabled} size='large' type='submit' variant='contained' loading={isPendingSendSurvey} color={'primary'} sx={{ width: { xs: 90, md: 150 }, mx: { xs: 'auto', md: 'inherit' }, maxHeight: 56 }}>
						Submit
					</LoadingButton>
				</Stack>
			</Stack>
		</FormProvider>
	);
}
