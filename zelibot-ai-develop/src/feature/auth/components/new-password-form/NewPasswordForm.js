import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, FormHelperText, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { Iconify } from '@zelibot/zeligate-ui';
import { useSnackbar } from 'notistack';
import FormProvider, { RHFTextField, RHFCodes } from '../../../../components/hook-form';
import { useAuthContext } from '../../context/useAuthContext';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function NewPasswordForm() {
	const { newPassword } = useAuthContext();
	const { push } = useRouter();

	const { enqueueSnackbar } = useSnackbar();

	const [showPassword, setShowPassword] = useState(false);

	const emailRecovery = typeof window !== 'undefined' ? sessionStorage.getItem('email-recovery') : '';

	const VerifyCodeSchema = Yup.object().shape({
		code: Yup.string().required('Code is required'),
		email: Yup.string().required('Email is required').email('Email must be a valid email address'),
		password: Yup.string()
			.min(8, 'Password must be at least 8 characters')
			.matches(/[a-z]/, 'Password must contain at least one lowercase character')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase character')
			.matches(/[0-9]/, 'Password must contain at least one number')
			.matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, 'Password must contain at least one special character')
			.required('Password is required'),
		confirmPassword: Yup.string()
			.required('Confirm password is required')
			.oneOf([Yup.ref('password'), null], 'Passwords must match'),
	});

	const defaultValues = {
		code: '',
		email: emailRecovery || '',
		password: '',
		confirmPassword: '',
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
		try {
			await newPassword(data.email, data.code, data.password);
			sessionStorage.removeItem('email-recovery');
			enqueueSnackbar('Change password success!');
			// await push(PATH_DASHBOARD.hrHelper.workspace);
		} catch (error) {
			//reset();
			const message = error?.message?.replace('Password did not conform with policy:', '') || error.replace('Password did not conform with policy:', '');
			setError('afterSubmit', {
				...error,
				message: message,
			});
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			{!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
			<Stack spacing={3}>
				<RHFTextField name='email' label='Email' disabled={!!emailRecovery} InputLabelProps={{ shrink: !!emailRecovery }} />

				<RHFTextField name='code' label='Verification Code' />

				<RHFTextField
					name='password'
					label='Password'
					type={showPassword ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
									<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<RHFTextField
					name='confirmPassword'
					label='Confirm New Password'
					type={showPassword ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
									<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<LoadingButton  fullWidth size='large' type='submit' variant='contained' loading={isSubmitting} sx={{backgroundColor: '#21044c', color: 'white', mt: 3}}>
					Update Password
				</LoadingButton>
			</Stack>
		</FormProvider>
	);
}
