import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

RHFTextField.propTypes = {
	name: PropTypes.string,
	helperText: PropTypes.node,
	placeHolder: PropTypes.string,
	type: PropTypes.string,
	inputVariant: PropTypes.string,
};

export default function RHFTextField({ name, helperText, placeHolder, type, inputVariant, ...other }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => <TextField type={type || 'text'} {...field} fullWidth variant={inputVariant} value={typeof field.value === 'number' && field.value === 0 ? '' : field.value} error={!!error} helperText={error ? error?.message : helperText} placeholder={placeHolder} {...other} />}
		/>
	);
}
