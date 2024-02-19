import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../../auth/context/useAuthContext';
// components
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { PATH_AUTH } from '../../../../routes/paths';
// state management
import { useDispatch } from '../../../../redux/store';
import { addUser } from '../../../../redux/slices/auth';
import { useRouter } from 'src/hooks/useRouter';
import useResponsive from 'src/hooks/useResponsive';
import { CTA_FLOW } from '../cta-section/CTASection';

// Quick styled component so these styles are unique to this use of RHFTextField
const StyledRHFTextField = styled(RHFTextField)(({ theme }) => ({
	'& .MuiInputBase-root': {
		color: 'black',
		width: '100%',
		height: '100%',
		'& > input': {
			[theme.breakpoints.up('xs')]: {
				fontSize: '1rem',
			},
			[theme.breakpoints.up('md')]: {
				fontSize: '1.5rem',
			},
		},
	},
}));

export default function RegisterForm({ setForm, setEmail }) {
	const { register } = useAuthContext();
	const isDesktop = useResponsive('up', 'md');
	const { push } = useRouter();
	const dispatch = useDispatch();

	function generateStrongPassword() {
		const length = 12;
		const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
		const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const numberChars = '0123456789';
		const specialChars = '!@#$%^&*()_-+="{};:,<.>';
		const getRandom = (chars) => {
			return chars.charAt(Math.floor(Math.random() * chars.length));
		};

		const randomPassword = () => {
			let password = '';
			password += getRandom(lowercaseChars);
			password += getRandom(uppercaseChars);
			password += getRandom(numberChars);
			password += getRandom(specialChars);

			const remainingLength = length - 4;
			const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars;

			for (let i = 0; i < remainingLength; i++) {
				password += getRandom(allChars);
			}

			return password
				.split('')
				.sort(() => Math.random() - 0.5)
				.join('');
		};

		return randomPassword();
	}

	const RegisterSchema = Yup.object().shape({
		//firstName: Yup.string().required('First name required'),
		//lastName: Yup.string().required('Last name required'),
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
		firstName: '',
		lastName: '',
		email: '',
		password: generateStrongPassword(),
	};

	const methods = useForm({
		resolver: yupResolver(RegisterSchema),
		defaultValues,
	});

	const {
		setError,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = methods;

	const onSubmit = async (data) => {
		try {
			const newUser = {
				email: data.email,
				firsName: data.firstName,
				lastName: data.lastName,
				password: data.password,
				accessToken: data.accessToken,
			};
			dispatch(addUser(newUser));
			await register(data.email, data.password, data.firstName);

			if (data.email.includes('@zelibot.com') || data.email.includes('@zelibot.ai')) {
				await push(PATH_AUTH.verify);
			} else {
				await setForm(CTA_FLOW.VERIFY);
				setEmail(data.email);
			}
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
			{!!errors.afterSubmit && (
				<Alert icon={<img src='/assets/images/warning-icon.png'></img>} severity='error' sx={{ width: '100%', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FF3C5D', textAlign: 'center' }}>
					{errors.afterSubmit.message}
				</Alert>
			)}
			<Stack flexDirection={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{}}>
				<StyledRHFTextField name='email' inputVariant='standard' placeHolder='Register here.' />
				{isDesktop ? (
					<LoadingButton color='primary' size='large' type='submit' variant='contained' loading={isSubmitting || isSubmitSuccessful} sx={{ minWidth: 215, backgroundColor: 'rgba(23, 0, 88, 1)', border: '1px solid white', color: 'white', padding: '12.8px 25.6px' }}>
						Start free trial
					</LoadingButton>
				) : (
					<LoadingButton fullWidth color='primary' size='large' type='submit' variant='contained' loading={isSubmitting || isSubmitSuccessful} sx={{ backgroundColor: 'rgba(23, 0, 88, 1)', border: '1px solid white', color: 'white', fontSize: 14, fontWeight: 600 }}>
						Start free trial
					</LoadingButton>
				)}
			</Stack>
		</FormProvider>
	);
}
