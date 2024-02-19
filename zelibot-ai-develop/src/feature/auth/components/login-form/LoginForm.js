import { useState, useEffect } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../context/useAuthContext';
// components
import { Iconify } from '@zelibot/zeligate-ui';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
//state management
import { useDispatch, useSelector } from '../../../../redux/store';
import { addUser } from '../../../../redux/slices/auth';
import RouterLink from 'src/components/router-link';
// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function LoginForm() {
	const dispatch = useDispatch();
	const { login } = useAuthContext();
	const [showPassword, setShowPassword] = useState(false);
	const [userEmail, setUserEmail] = useState('');

	const { userState } = useSelector((state) => state.auth);

	const LoginSchema = Yup.object().shape({
		email: Yup.string().required('Email is required').email('Email must be a valid email address'),
		password: Yup.string().required('Password is required'),
	});

	const defaultValues = {
		email: '',
		password: '',
	};

	useEffect(() => {
		if (userState.password) {
			login(userState.email, userState.password);
			const newUser = {
				password: '',
			};
			dispatch(addUser(newUser));
		}

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const userEmail = urlParams.get('userEmail');
		setUserEmail(userEmail);
	}, [userState.password]);

	const methods = useForm({
		resolver: yupResolver(LoginSchema),
		defaultValues,
	});

	const {
		reset,
		setError,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = methods;

	const onSubmit = async (data) => {
		try {
			await login(data.email, data.password);
		} catch (error) {
			console.error(error);
			//reset();
			let message = error.message || error;
			if (message === 'User is not confirmed.') {
				message = 'Please check your email to confirm your account';
			}
			setError('afterSubmit', {
				...error,
				message: message,
			});
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2}>
				{!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
				<RHFTextField name='email' label='Email address' placeHolder={'Email Address'} value={userEmail} InputLabelProps={{ shrink: true }} />
				<RHFTextField
					name='password'
					label='Password'
					type={showPassword ? 'text' : 'password'}
					placeHolder={'Password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
									<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
								</IconButton>
							</InputAdornment>
						),
					}}
					InputLabelProps={{ shrink: true }}
				/>
			</Stack>

			<Stack display={'flex'} direction={'row'} justifyContent={'flex-end'} sx={{ mt: 2 }}>
				<Link
					component={RouterLink}
					to={{
						pathname: PATH_AUTH.resetPassword,
						search: window.location.search,
					}}
					variant='body2'
					underline='always'
				>
					Forgot password?
				</Link>
			</Stack>

			<LoadingButton fullWidth color='primary' size='large' type='submit' variant='contained' loading={isSubmitSuccessful || isSubmitting} sx={{ marginY: '20px' }}>
				Login
			</LoadingButton>
		</FormProvider>
	);
}
