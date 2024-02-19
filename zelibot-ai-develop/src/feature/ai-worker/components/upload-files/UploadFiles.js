import {useDropzone} from 'react-dropzone';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
	DocumentList,
	DocumentName,
	DocumentTypeItem,
	Heading,
	Inset,
	StyledDropZone,
	StyledUploadFiles
} from './UploadFilesStyles';
import UploadFilesPreview from './UploadFilesPreview';
import {fData} from '../../../../utils/formatNumber';
import {fileDropzoneProps, fileMimeTypeText, uploadFilesToS3} from '../../constants';
import {useControlled} from '../../hooks';
import {forwardRef, useCallback, useEffect, useMemo, useState} from 'react';
import UploadFilesContext from './UploadFilesContext';
import {useTheme} from '@mui/material/styles';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { v4 as uuidv4 } from 'uuid';
import {errorMessages} from "./UploadFileConstants";
import UserFeedback from '../../../../components/user-feedback/UserFeedback';

const ACCEPTED_EXTENSIONS = ['.pdf', '.txt', '.docx'];

const getAcceptedFormatsFiles = (files) => {
	let newFiles = [];
	files.forEach((file) => {
		ACCEPTED_EXTENSIONS.forEach((format) => {
			if (file.name.endsWith(format)) {
				newFiles.push({
					id: uuidv4(),
					file,
				});
			}
		});
	});
	return newFiles;
};

const UploadFiles = forwardRef(function UploadFiles(props, ref) {
	const { multiple = true, disabled, variant = 'upload-preview', fileSizeLimit = fileDropzoneProps.maxSize, mimeTypes = fileDropzoneProps.accept, setFilesUploaded, onUploaded, type, event_id, disabledFeedback, ...other } = props;

	const { outputCardAction } = other;

	const { showHeading = false, showFileTypes = false } = other;

	const [files, setFiles] = useControlled({
		controlled: props.files,
		default: [],
		name: 'UploadFiles',
	});

	const [completedFiles, setCompletedFiles] = useState([]);
	const [res, setRes] = useState('');
	const [uploadedCount, setUploadedCount] = useState(0);
	const [selectedFilesCount, setSelectedFilesCount] = useState(0);

	useEffect(() => {
		const uploadedFiles = files.filter(({error}) => !error);
		if (selectedFilesCount > 0 && uploadedCount === uploadedFiles.length) {
			if (outputCardAction) {
				outputCardAction(undefined, selectedFilesCount > 1 ? 'DOCUMENTS_UPLOADED' : 'DOCUMENT_UPLOADED');
			}
			setSelectedFilesCount(0);
		}
	}, [uploadedCount]);

	const validateFiles = useCallback(
		(selectedFiles) => {
			return selectedFiles.map(
				(file) => {
					const isSupportedFormat = ACCEPTED_EXTENSIONS.some((format) => file.name.endsWith(format));
					if (!isSupportedFormat) {
						return {
							id: uuidv4(),
							file,
							error: errorMessages[0],
						};
					}

					if (file.size > fileSizeLimit) {
						return {
							id: uuidv4(),
							file,
							error: errorMessages[1],
						};
					}

					return {
						id: uuidv4(),
						file,
					};
				},
			);
		},
		[fileSizeLimit, mimeTypes],
	);

	const handleDropFiles = useCallback(
		(acceptedFiles) => {
			// if acceptedFiles has same name with files, then don't add it to files
			// const newFiles = acceptedFiles.filter((item) => !files.some((file) => file.name === item.name));
			const filesWithUniqueNames = acceptedFiles.filter((item) => !files.some((file) => file.name === item.name));
			const newFiles = validateFiles(filesWithUniqueNames);
			const validFiles = newFiles.filter(({error}) => !error);
			setSelectedFilesCount(validFiles.length);
			setFiles([...files, ...newFiles]);
			// Automatically upload hack -- needs to be passed through as state isn't set yet if called from here
			// handleUploadFiles([...files, ...newFiles]);
		},
		[files, setFiles]
	);

	const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
		multiple,
		disabled: disabled || selectedFilesCount > 0,
		onDrop: handleDropFiles,
		// maxSize: fileSizeLimit,
		// accept: mimeTypes,
		...other,
	});

	const handleRemoveFile = (fileId) => {
		const newFiles = files.filter(({id}) => id !== fileId);
		setFiles(newFiles);
		// console.log('The new files are: ', newFiles);
	};

	const handleRemoveAllFiles = () => {
		setFiles([]);
	};

	// prop is an optional way to have files passed in rather than relying on state
	const handleUploadFiles = async (filesProp) => {
		// console.log('handle upload files');
		const sendFiles = files?.length > 0 ? files : filesProp?.target?.files?.length > 0 ? getAcceptedFormatsFiles(Array.from(filesProp?.target?.files)) : [];
		// await uploadFilesToS3(filesProp || files)
		uploadFilesToS3(sendFiles)
			.then((response) => {
				if (response && response.ok) setFilesUploaded(true);
				setRes('success');
				setFiles([]);
				setCompletedFiles([...completedFiles, ...sendFiles]);
				if (outputCardAction) {
					outputCardAction(undefined, sendFiles.length > 1 ? 'DOCUMENTS_UPLOADED' : 'DOCUMENT_UPLOADED');
				}
			})
			.catch((error) => {
				setRes('error');
			});
	};

	const hasFiles = (files && files.length > 0) || (completedFiles && completedFiles.length > 0);
	const isError = isDragReject || res === 'error';
	const contextValue = useMemo(
		() => ({
			files,
			increaseUploadedCount: () => setUploadedCount((prevState) => prevState + 1),
			onRemoveFile: handleRemoveFile,
			onRemoveAllFiles: handleRemoveAllFiles,
			onUploadFiles: handleUploadFiles,
		}),
		[files, handleRemoveFile, handleRemoveAllFiles, handleUploadFiles]
	);

	const theme = useTheme();
	const sp = theme.spacing;
	const documentTypes = ['Job requisitions', 'Position descriptions', 'Company policies', 'Offer letters', 'Employee contracts'];

	return (
		<StyledUploadFiles ref={ref}>
			{showHeading && <Heading />}
			{showFileTypes && (
				<DocumentList style={{ gap: sp(1) }}>
					{documentTypes.map((text, i) => (
						<DocumentTypeItem key={text + i} style={{ marginLeft: sp(2) }} Icon={() => <DescriptionRoundedIcon color='primary' />} Content={() => <DocumentName text={text} />} />
					))}
				</DocumentList>
			)}

			<Inset>
				<UploadFilesContext.Provider value={contextValue}>
					{variant.includes('upload') && (
						<StyledDropZone
							{...getRootProps()}
							sx={{
								...(isDragActive && {
									opacity: 0.72,
								}),
								...(isError && {
									color: 'error.main',
									bgcolor: 'error.lighter',
									borderColor: 'error.light',
								}),
								...(disabled && {
									opacity: 0.48,
									pointerEvents: 'none',
								}),
								...(files.length === 0 && {
									flexGrow: 1,
								}),
							}}
						>
							<input {...getInputProps()} onChange={handleUploadFiles} />
							<Stack
								alignItems='center'
								justifyContent='center'
								direction="column"
								sx={{
									width: 1,
									textAlign: {
										xs: 'center',
										md: 'left',
									},
								}}
								spacing={1}
							>
								<Avatar variant="square" sx={{ backgroundColor: 'background.default'}}>
									<UploadFileIcon sx={{ color: 'primary.light' }} />
								</Avatar>
								<Box sx={{ fontSize: '18px', color: 'primary.light' }}>
									<Typography variant='h6' sx={{ display: 'inline', textDecoration: 'underline' }}>
										Choose files to upload{' '}
									</Typography>
									<Typography variant='body1' sx={{ display: 'inline', fontSize: 'inherit', color: '#21054C' }}>
										or drag and drop
									</Typography>
								</Box>
								<Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
									{mimeTypes &&
										Object.keys(mimeTypes).map((type, index) => (
											<Typography key={index} variant='body2' component={'span'} sx={{ display: 'inline', color: 'text.primary', textTransform: 'uppercase' }}>
												{fileMimeTypeText(type)}
												{index < Object.keys(mimeTypes).length - 1 ? ', ' : ' '}
											</Typography>
										))}
									(maximum {fData(fileSizeLimit)})
								</Typography>
							</Stack>
						</StyledDropZone>
					)}

					{(variant === 'preview' && hasFiles) || (variant === 'upload-preview' && hasFiles && <UploadFilesPreview />)}
				</UploadFilesContext.Provider>
			</Inset>
			{!disabledFeedback &&
				<Stack direction="row" alignItems="center" justifyContent="flex-end">
					<UserFeedback type={type} event_id={event_id} />
				</Stack>
			}
		</StyledUploadFiles>
	);
});

export default UploadFiles;
