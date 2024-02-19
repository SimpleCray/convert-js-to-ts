import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import { UploadAvatar, Upload, UploadBox } from '../upload';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

RHFUploadAvatar.propTypes = {
	name: PropTypes.string,
};

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<div style={{ width: 160, height: 160, marginLeft: 8 }}>
					<UploadAvatar
						accept={{
							'image/*': [],
						}}
						error={!!error}
						file={field.value}
						{...other}
					/>

					{!!error && (
						<FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
							{error.message}
						</FormHelperText>
					)}
				</div>
			)}
		/>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

RHFUploadBox.propTypes = {
	name: PropTypes.string,
};

export function RHFUploadBox({ name, ...other }) {
	const { control } = useFormContext();

	return <Controller name={name} control={control} render={({ field, fieldState: { error } }) => <UploadBox files={field.value} error={!!error} {...other} />} />;
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

RHFUpload.propTypes = {
	name: PropTypes.string,
	multiple: PropTypes.bool,
	helperText: PropTypes.node,
};

export function RHFUpload({ name, multiple, helperText, ...other }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) =>
				multiple ? (
					<Upload
						multiple
						accept={{ 'image/*': [] }}
						files={field.value}
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
				) : (
					<Upload
						accept={{ 'image/*': [] }}
						file={field.value}
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
				)
			}
		/>
	);
}
