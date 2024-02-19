import {useState} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import {Alert, IconButton, InputAdornment, Stack} from '@mui/material';
import {Iconify} from '@zelibot/zeligate-ui';
import {useSnackbar} from 'notistack';

import FormProvider, {RHFTextField} from '../../../../../components/hook-form';
import {useAuthContext} from '../../../../auth/context/useAuthContext';
import {StyledButton, StyledLoadingButton, StyledTypography} from "./AccountStyles";

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function AccountChangePassword({onClose}) {
	const { enqueueSnackbar } = useSnackbar();
	const { changePassword } = useAuthContext();
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const ChangePassWordSchema = Yup.object().shape({
		oldPassword: Yup.string().required('Old Password is required'),
		newPassword: Yup.string()
			.min(8, 'Password must be at least 8 characters')
			.matches(/[a-z]/, 'Password must contain at least one lowercase character')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase character')
			.matches(/[0-9]/, 'Password must contain at least one number')
			.matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, 'Password must contain at least one special character')
			.required('New Password is required'),
		confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
	});

	const defaultValues = {
		oldPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	};

	const methods = useForm({
		resolver: yupResolver(ChangePassWordSchema),
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
			await changePassword(data.oldPassword, data.newPassword);
			reset();
			enqueueSnackbar('Update success!');
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
			{!!errors.afterSubmit && <Alert severity='error'>{errors.afterSubmit.message}</Alert>}
			<Stack gap={5}>
				<StyledTypography>
					Change your log in password
				</StyledTypography>

				<Stack gap={2} sx={{ width: 604 }}>
					<RHFTextField
						name='oldPassword'
						type={showOldPassword ? 'text' : 'password'}
						label='Old Password'
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge='end'>
										<Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<StyledTypography>
						The  password requirements are to use 8 or more characters with a mix of letters, numbers and symbols
					</StyledTypography>
					<RHFTextField
						name='newPassword'
						type={showPassword ? 'text' : 'password'}
						label='New Password'
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
					/>
					<RHFTextField
						name='confirmNewPassword'
						type={showConfirmPassword ? 'text' : 'password'}
						label='Confirm New Password'
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge='end'>
										<Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Stack>

				<Stack gap={3} direction='row' justifyContent='flex-end'>
					<StyledButton variant='outlined' color='primary' onClick={onClose}>
						Cancel
					</StyledButton>
					<StyledLoadingButton type='submit' variant='contained' color='primary' loading={isSubmitting}>
						Save
					</StyledLoadingButton>
				</Stack>
			</Stack>
		</FormProvider>
	);
}
