import { Typography, TextField, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider from '../../../../components/hook-form';
import Image from '../../../../components/image';
import InputAdornment from '@mui/material/InputAdornment';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTheme } from '@mui/material/styles';

const themed = (Component) => (props) => {
	const theme = useTheme();
	return <Component {...{ theme, ...props }} />;
};

export const ContinueButton = ({ text, loading, style }) => (
	<LoadingButton color='primary' type='submit' size='large' variant='contained' loading={loading} style={style}>
		<span style={{ textTransform: 'none' }}>{text}</span>
	</LoadingButton>
);
export const SkipButton = ({ text, loading, style, onClick }) => (
	<LoadingButton color='primary' onClick={onClick} size='large' variant='outlined' loading={loading} style={style}>
		<span style={{ textTransform: 'none' }}>{text}</span>
	</LoadingButton>
);

export const Heading = ({ text, style }) => (
	<Typography variant='h3' component={'h2'} style={style}>
		{text}
	</Typography>
);
export const Description = ({ text, style }) => (
	<Typography variant='body2' component={'p'} style={style}>
		{text}
	</Typography>
);
export const FormItem = themed(({ disabled, value, setValue, label, placeholder, error, style, theme, helperText }) => (
	<TextField
		fullWidth
		value={value}
		error={error}
		disabled={disabled}
		// helperText={'Required'}
		label={label}
		placeholder={placeholder ?? label}
		style={style}
		helperText={helperText}
		InputProps={
			error === undefined
				? undefined
				: {
						endAdornment: (
							<InputAdornment position='end'>
								<WarningAmberRounded style={{ color: theme.palette.error.main }} />
							</InputAdornment>
						),
					}
		}
		onChange={(e) => setValue(e.target.value)}
	/>
));
export const Form = ({ onSubmit, children, style }) => (
	<Card style={style}>
		<FormProvider onSubmit={onSubmit} style={{ height: '100%' }}>
			{children}
		</FormProvider>
	</Card>
);

export const Spacer = ({ style }) => <div style={{ flex: '1', ...style }} />;
export const FillerImage = ({ style }) => <Image src='/assets/images/auth/auth-register-avatars.png' alt='list of avatars' style={style} />;
