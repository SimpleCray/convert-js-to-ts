import PropTypes from 'prop-types';
import { useRef } from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Stack, TextField } from '@mui/material';
// hooks
import useEventListener from '../../hooks/useEventListener';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

RHFCodes.propTypes = {
	keyName: PropTypes.string,
	inputs: PropTypes.arrayOf(PropTypes.string),
};

export default function RHFCodes({ keyName = '', inputs = [], ...other }) {
	const codesRef = useRef(null);

	const { control, setValue } = useFormContext();

	const handlePaste = (event) => {
		let data = event.clipboardData.getData('text');

		data = data.split('');

		inputs.map((input, index) => setValue(input, data[index]));

		event.preventDefault();
	};

	const handleChangeWithNextField = (event, handleChange) => {
		const { maxLength, value, name } = event.target;

		const fieldIndex = name.replace(keyName, '');

		const fieldIntIndex = Number(fieldIndex);

		const nextfield = document.querySelector(`input[name=${keyName}${fieldIntIndex + 1}]`);

		if (value.length > maxLength) {
			event.target.value = value[0];
		}

		if (value.length >= maxLength && fieldIntIndex < 6 && nextfield !== null) {
			nextfield.focus();
		}

		handleChange(event);
	};

	useEventListener('paste', handlePaste, codesRef);

	return (
		<Stack direction='row' spacing={{ xs: 1, md: 2 }} justifyContent='center' ref={codesRef}>
			{inputs.map((name, index) => (
				<Controller
					key={'RHF-CODES-Key-2' + name}
					name={`${keyName}${index + 1}`}
					control={control}
					render={({ field, fieldState: { error } }) => (
						<TextField
							{...field}
							error={!!error}
							autoFocus={index === 0}
							onChange={(event) => {
								handleChangeWithNextField(event, field.onChange);
							}}
							onFocus={(event) => event.currentTarget.select()}
							InputProps={{
								sx: {
									width: { xs: 30, md: 40 },
									height: { xs: 36, md: 48 },
									border: '2px solid #3B0099',
									'& input': { p: 0, textAlign: 'center', color: 'black', fontWeight: 700 },
								},
							}}
							inputProps={{
								maxLength: 1,
								type: 'number',
							}}
							{...other}
						/>
					)}
				/>
			))}
		</Stack>
	);
}
