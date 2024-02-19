import PropTypes from 'prop-types';
import {useEffect, useMemo} from 'react';
import { v4 as uuidv4 } from 'uuid';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import Editor from '../editor';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

RHFEditor.propTypes = {
	name: PropTypes.string,
	helperText: PropTypes.node,
};

export default function RHFEditor({ name, helperText, onEditorChange, ...other }) {
	const {
		control,
		watch,
		setValue,
		formState: { isSubmitSuccessful, isDirty },
		getValues,
	} = useFormContext();

	const id = useMemo(() => `editor-${uuidv4()}`, []);

	const values = watch();

	useEffect(() => {
		if (values[name] === '<p><br></p>') {
			setValue(name, '', {
				shouldValidate: !isSubmitSuccessful,
			});
		}
	}, [isSubmitSuccessful, name, setValue, values]);

	// useEffect(() => {
	// 	console.log('form is dirty?', isDirty);
	// }, [isDirty]);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => {
				// console.log('RHF field value', field.value); // massive console spam
				return (
					<Editor
						id={id}
						value={field.value}
						onChange={(e) => {
							field.onChange(e)
							onEditorChange(true) // determine whether the current content is different than what it started as
						}}
						error={!!error}
						helperText={
							(!!error || helperText) && (
								<FormHelperText error={!!error} sx={{ px: 2 }}>
									{error ? error?.message : helperText}
								</FormHelperText>
							)
						}
						{...other}
					/>
				);
			}}
		/>
	);
}
