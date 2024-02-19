import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
//
import { Iconify } from '@zelibot/zeligate-ui';
//
import RejectionFiles from './errors/RejectionFiles';
import AvatarPreview from './preview/AvatarPreview';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
	width: '100%',
	height: '100%',
	margin: 'auto',
	display: 'flex',
	cursor: 'pointer',
	overflow: 'hidden',
	borderRadius: '50%',
	alignItems: 'center',
	position: 'relative',
	justifyContent: 'center',
}));

const StyledPlaceholder = styled('div')(({ theme }) => ({
	zIndex: 7,
	display: 'flex',
	borderRadius: '50%',
	position: 'absolute',
	alignItems: 'center',
	flexDirection: 'column',
	justifyContent: 'center',
	width: '100%',
	height: '100%',
	color: theme.palette.text.disabled,
	backgroundColor: theme.palette.background.neutral,
	transition: theme.transitions.create('opacity', {
		easing: theme.transitions.easing.easeInOut,
		duration: theme.transitions.duration.shorter,
	}),
}));

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

UploadAvatar.propTypes = {
	sx: PropTypes.object,
	error: PropTypes.bool,
	disabled: PropTypes.bool,
	helperText: PropTypes.node,
	file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function UploadAvatar({ error, file, disabled, helperText, sx, ...other }) {
	const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
		multiple: false,
		disabled,
		...other,
	});

	const hasFile = !!file;

	const isError = isDragReject || !!error;

	return (
		<>
			<StyledDropZone
				{...getRootProps()}
				sx={{
					...(isDragActive && {
						opacity: 0.72,
					}),
					...(isError && {
						borderColor: 'error.light',
						...(hasFile && {
							bgcolor: 'error.lighter',
						}),
					}),
					...(disabled && {
						opacity: 0.48,
						pointerEvents: 'none',
					}),
					...(hasFile && {
						'&:hover': {
							'& .placeholder': {
								opacity: 1,
							},
						},
					}),
					...sx,
				}}
			>
				<input {...getInputProps()} />

				{hasFile && <AvatarPreview file={file} />}

				<StyledPlaceholder
					className='placeholder'
					sx={{
						'&:hover': {
							opacity: 0.72,
						},
						...(hasFile && {
							zIndex: 9,
							opacity: 0,
							color: 'common.white',
							bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
						}),
						...(isError && {
							color: 'error.main',
							bgcolor: 'error.lighter',
						}),
					}}
				>
					<AddAPhotoOutlinedIcon sx={{color: 'white', fontSize: 48}}/>
				</StyledPlaceholder>
			</StyledDropZone>

			{helperText && helperText}

			<RejectionFiles fileRejections={fileRejections} />
		</>
	);
}
