import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { useAuthContext } from '../../context/useAuthContext';
import { Alert } from '@mui/material';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
	const { resetPassword } = useAuthContext();
	const { push } = useRouter();

	const ResetPasswordSchema = Yup.object().shape({
		email: Yup.string().required('Email is required').email('Email must be a valid email address'),
	});

	const methods = useForm({
		resolver: yupResolver(ResetPasswordSchema),
		defaultValues: { email: '' },
	});

	const {
		reset,
		setError,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = methods;

	const onSubmit = async (data) => {
		try {
			await resetPassword(data.email);
			sessionStorage.setItem('email-recovery', data.email);
			await push(PATH_AUTH.newPassword);
		} catch (error) {
			//reset();
			setError('afterSubmit', {
				...error,
				message: error.message || error,
			});
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			{!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
			<RHFTextField name='email' label='Email address' />

			<LoadingButton sx={{backgroundColor: '#21044c', color: 'white', mt: 3}} fullWidth size='large' type='submit' variant='contained' loading={isSubmitting}>
				Send Request
			</LoadingButton>
		</FormProvider>
	);
}
