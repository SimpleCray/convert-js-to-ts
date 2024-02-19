import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
//
import { fileData } from '../../file-thumbnail';
import {errorMessages} from "../../../feature/ai-worker/components/upload-files/UploadFileConstants";

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

RejectionFiles.propTypes = {
	fileRejections: PropTypes.array,
};

export default function RejectionFiles({ fileRejections }) {
	if (!fileRejections.length) {
		return null;
	}

	// console.log('fileRejections', fileRejections);

	return (
		<Paper
			variant='outlined'
			sx={{
				py: 1,
				px: 2,
				mt: 3,
				bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
				borderColor: (theme) => alpha(theme.palette.error.main, 0.24),
			}}
		>
			{fileRejections.map(({ file, errors }) => {
				const { path, size } = fileData(file);

				return (
					<Box key={path} sx={{ my: 1 }}>
						<Typography variant='subtitle2' noWrap>
							{path} - {size ? fData(size) : ''}
						</Typography>

						{errors.map((error) => (
							<Box key={error.code} component='span' sx={{ typography: 'caption' }}>
								{/* - {error.message} */}
								- {errorMessages.find((em) => em.code === error.code).message || 'Invalid file'}&nbsp;
							</Box>
						))}
					</Box>
				);
			})}
		</Paper>
	);
}
