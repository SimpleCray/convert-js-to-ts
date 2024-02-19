import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, FormHelperText, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../../routes/paths';
// components
import { useSnackbar } from 'notistack';
import FormProvider, { RHFCodes, RHFTextField } from '../../../../components/hook-form';
import { useAuthContext } from '../../context/useAuthContext';
//state management
import { useSelector } from '../../../../redux/store';
import { useEffect, useState } from 'react';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function VerifyCodeForm() {
	const { userState } = useSelector((state) => state.auth);
	const { verifyCode, login } = useAuthContext();
	const [loading, setLoading] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const VerifyCodeSchema = Yup.object().shape({
		code: Yup.string().required('Code is required'),
	});

	const defaultValues = {
		code: '',
	};

	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(VerifyCodeSchema),
		defaultValues,
	});

	const {
		reset,
		setError,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = methods;

	const onSubmit = async (data) => {
		// console.log(data)

		try {
			if (data.code.length === 6) {
				setLoading(true);
				await verifyCode(data.code, userState.email);
				enqueueSnackbar('Your account has been verified. Logging you in...', { variant: 'success' });
				await login(userState.email, userState.password, PATH_AUTH.onboarding);
			} else {
				setLoading(false);
				enqueueSnackbar('Invalid PIN', { variant: 'error' });
			}
		} catch (error) {
			setLoading(false);
			setError('afterSubmit', {
				...error,
				message: error.message || error,
			});
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				{!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

				<RHFTextField name='code' label='Verification Code' />

				<LoadingButton
					sx={{ backgroundColor: '#21044c', color: 'white', mt: 3 }}
					fullWidth size='large' type='submit' variant='contained' loading={isSubmitting || loading}>
					Verify
				</LoadingButton>
			</Stack>
		</FormProvider>
	);
}
