import ProgressBar from '../progress-bar/ProgressBar';
import {Stack} from '@mui/material';
import UploadFilesContext from './UploadFilesContext';
import {forwardRef, useContext} from 'react';

const UploadFilesPreview = forwardRef(function UploadFilesPreview(props, ref) {
	const { files, onRemoveAllFiles } = useContext(UploadFilesContext);

	const handleOnRemoveAll = () => {
		if (onRemoveAllFiles) {
			onRemoveAllFiles();
		}
	};

	return (
		<Stack
			alignItems='center'
			justifyContent='center'
			direction="column"
			sx={{mt: 1.5}}
			spacing={1.5}
			ref={ref}
		>
			{files.map(({id, file, error}) => <ProgressBar key={id} fileId={id} file={file} error={error} />)}
			{/*{files.length > 0 && (*/}
			{/*	<Stack direction='row' justifyContent='flex-end' spacing={1.5}>*/}
			{/*		<Button color='inherit' variant='outlined' size='small' onClick={handleOnRemoveAll}>*/}
			{/*			Remove all*/}
			{/*		</Button>*/}
			{/*		<Button size='small' variant='contained' onClick={handleOnUpload}>*/}
			{/*			Upload files*/}
			{/*		</Button>*/}
			{/*	</Stack>*/}
			{/*)}*/}
		</Stack>
	);
});

export default UploadFilesPreview;
