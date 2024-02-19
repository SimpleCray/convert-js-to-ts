import { useState, useEffect } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../context/useAuthContext';
// components
import { Iconify } from '@zelibot/zeligate-ui';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { PATH_AUTH } from '../../../../routes/paths';
// state management
import { useDispatch, useSelector } from '../../../../redux/store';
import { addUser } from '../../../../redux/slices/auth';
import { useRouter } from 'src/hooks/useRouter';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function RegisterForm() {
	const { register } = useAuthContext();
	const { push } = useRouter();
	const dispatch = useDispatch();

	const [showPassword, setShowPassword] = useState(false);
	const [userEmail, setUserEmail] = useState('');

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);

		const userEmail = urlParams.get('userEmail');
		setUserEmail(userEmail);
	});

	const RegisterSchema = Yup.object().shape({
		firstName: Yup.string().required('First name required'),
		lastName: Yup.string().required('Last name required'),
		email: Yup.string().required('Email is required').email('Email must be a valid email address'),
		password: Yup.string()
			.min(8, 'Password must be at least 8 characters')
			.matches(/[a-z]/, 'Password must contain at least one lowercase character')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase character')
			.matches(/[0-9]/, 'Password must contain at least one number')
			.matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, 'Password must contain at least one special character')
			.required('Password is required'),
	});

	const defaultValues = {
		firstName: 'Go to Profile',
		lastName: 'Not Set',
		email: '',
		password: '',
	};

	const methods = useForm({
		resolver: yupResolver(RegisterSchema),
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
			const newUser = {
				email: data.email,
				firsName: data.firsName,
				lastName: data.lastName,
				password: data.password,
				accessToken: data.accessToken,
			};
			dispatch(addUser(newUser));
			await register(data.email, data.password, data.firstName);
			// await push(PATH_AUTH.verify);
			await push({
				pathname: PATH_AUTH.verify,
				search: window.location.search,
			});
		} catch (error) {
			const message = error?.message?.replace('Password did not conform with policy:', '') || error.replace('Password did not conform with policy:', '');
			setError('afterSubmit', {
				...error,
				message: message,
			});
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2.5}>
				{!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}

				{/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack> */}

				<RHFTextField name='email' label='Email address' placeHolder={'Email Address'} value={userEmail} InputLabelProps={{ shrink: true }} />

				<RHFTextField
					name='password'
					label='Password'
					placeHolder={'Password'}
					type={showPassword ? 'text' : 'password'}
					helperText={'Use 8 or more characters with a mix of letters, numbers & symbols'}
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

				<LoadingButton fullWidth color='primary' size='large' type='submit' variant='contained' loading={isSubmitting || isSubmitSuccessful}>
					Create account
				</LoadingButton>
			</Stack>
		</FormProvider>
	);
}
