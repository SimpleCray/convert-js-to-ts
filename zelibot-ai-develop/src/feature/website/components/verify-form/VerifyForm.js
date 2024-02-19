import { Link, Stack, Typography, Box } from '@mui/material';
import { useAuthContext } from '../../../auth/context/useAuthContext';
import { useSnackbar } from 'notistack';
import { useSelector } from '../../../../redux/store';
import FormProvider, { RHFCodes } from '../../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Text18MediumPurpleWeight400, Text18MidnightPurpleWeight400 } from '../../../../components/common/TypographyStyled';
import { WarningAmberRounded as WarningAmberRoundedIcon } from '@mui/icons-material';
import { CTA_FLOW } from '../cta-section/CTASection';
// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function VerifyCodePage({ setForm }) {
	const { resendCode, verifyCode } = useAuthContext();
	const { enqueueSnackbar } = useSnackbar();
	const { userState } = useSelector((state) => state.auth);

	const resendCodeSubmit = () => {
		try {
			resendCode(userState?.email)
				.then(() => {
					enqueueSnackbar('Code resent', { variant: 'success' });
				})
				.catch((error) => {
					const message = error?.message || error;
					enqueueSnackbar(message, { variant: 'error' });
				});
		} catch (error) {
			console.error(error);
			const message = error?.response?.data?.message || '[2] Something went wrong';
			enqueueSnackbar(message, { variant: 'error' });
		}
	};

	const VerifyCodeSchema = Yup.object().shape({
		code1: Yup.string().required('Code is required'),
		code2: Yup.string().required('Code is required'),
		code3: Yup.string().required('Code is required'),
		code4: Yup.string().required('Code is required'),
		code5: Yup.string().required('Code is required'),
		code6: Yup.string().required('Code is required'),
	});

	const defaultValues = {
		code1: '',
		code2: '',
		code3: '',
		code4: '',
		code5: '',
		code6: '',
	};

	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(VerifyCodeSchema),
		defaultValues,
	});

	const {
		setError,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = methods;

	const onVerifySubmit = async (data) => {
		try {
			const pin = Object.values(data).join('');
			if (pin.length === 6) {
				await verifyCode(pin, userState.email);
				await setForm(CTA_FLOW.SELECT_ZELI);
			} else {
				enqueueSnackbar('Invalid PIN', { variant: 'error' });
			}
		} catch (error) {
			//reset();
			setError('afterSubmit', {
				...error,
				message: error.message || error,
			});
		}
	};

	return (
		<>
			<FormProvider methods={methods} onSubmit={handleSubmit(onVerifySubmit)}>
				<Stack gap={3}>
					<Stack>
						<Text18MidnightPurpleWeight400 gutterBottom>Kindly enter the verification code sent to your email.</Text18MidnightPurpleWeight400>
						<Text18MediumPurpleWeight400 sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
							<Link variant='subtitle1' onClick={resendCodeSubmit} sx={{ color: 'inherit', fontWeight: 'inherit' }}>
								Send a new code.
							</Link>
						</Text18MediumPurpleWeight400>
					</Stack>
					<Stack direction={{ xs: 'direction', md: 'row' }} alignItems={'center'} justifyContent='space-between' spacing={2.5} flexWrap='wrap'>
						<Stack direction={{ xs: 'direction', md: 'row' }} alignItems={'center'} gap={2} flexWrap='wrap'>
							<Box sx={{ justifySelf: 'center' }}>
								<RHFCodes keyName='code' inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']} />
							</Box>
							{!!errors.afterSubmit && (
								<Stack direction='row' alignItems='center' gap={0.5}>
									<WarningAmberRoundedIcon style={{ color: '#FF3C5D' }} />
									<Typography textAlign={'center'} variant='p' sx={{ color: '#FF3C5D', fontSize: { xs: '14px', md: '16px' } }}>
										{errors.afterSubmit.message}
									</Typography>
								</Stack>
							)}
							{(!!errors.code1 || !!errors.code2 || !!errors.code3 || !!errors.code4 || !!errors.code5 || !!errors.code6) && (
								<Stack direction='row' alignItems='center' gap={0.5}>
									<WarningAmberRoundedIcon style={{ color: '#FF3C5D' }} />
									<Typography textAlign={'center'} variant='p' sx={{ color: '#FF3C5D', fontSize: { xs: '14px', md: '16px' } }}>
										Code is required
									</Typography>
								</Stack>
							)}
						</Stack>
						<LoadingButton size='large' type='submit' variant='contained' loading={isSubmitting} color={'primary'} sx={{ width: { xs: 90, md: 150 }, mx: { xs: 'auto', md: 'inherit' } }}>
							Confirm
						</LoadingButton>
					</Stack>
				</Stack>
			</FormProvider>
		</>
	);
}
