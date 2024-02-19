import {useContext, useEffect, useState} from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import {IconButton, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import {fData} from '../../../../utils/formatNumber';
import {StyledMeta, StyledProgressBar, StyledProgressButton, StyledProgressText} from './ProgressBarStyles';
import UploadFilesContext from "../upload-files/UploadFilesContext";
import {uploadFileToS3} from "../../constants";

const UPLOAD_STATUS_ENUM = {
	Uploading: 0,
	Success: 1,
	Error: 2,
	Waiting: 3,
};

const UPLOAD_STATUS = {
	[UPLOAD_STATUS_ENUM.Uploading]: 'Loading',
	[UPLOAD_STATUS_ENUM.Success]: 'Complete',
	[UPLOAD_STATUS_ENUM.Error]: 'Error',
	[UPLOAD_STATUS_ENUM.Waiting]: 'Wait...',
}

const ProgressBar = ({ fileId, file, error }) => {
	const { onRemoveFile, increaseUploadedCount } = useContext(UploadFilesContext);

	const [progress, setProgress] = useState(0);
	const [color, setColor] = useState('');
	const [loadingStatus, setLoadingStatus] = useState(UPLOAD_STATUS_ENUM.Waiting);
	const [loadingMessage, setLoadingMessage] = useState(UPLOAD_STATUS[UPLOAD_STATUS_ENUM.Waiting]);
	const [timer, setTimer] = useState(undefined);

	const handleUploadFiles = (file) => {
		uploadFileToS3(file)
			.then((response) => {
				setProgress(100);
				setLoadingStatus(UPLOAD_STATUS_ENUM.Success);
			})
			.catch((error) => {
				console.error(error, 'fails uploading file');
				setLoadingStatus(UPLOAD_STATUS_ENUM.Error);
				setColor('#FF3C5D');
			});
	};

	useEffect(() => {
		if (!file) {
			return;
		}

		if (error) {
			setLoadingStatus(UPLOAD_STATUS_ENUM.Error);
			setColor('#FF3C5D');
			return;
		}

		setLoadingStatus(UPLOAD_STATUS_ENUM.Uploading);
		handleUploadFiles(file);
		const tmpTimer = setInterval(() => {
			setProgress((oldProgress) => {
				if (oldProgress === 100) {
					return 100;
				}
				return Math.min(oldProgress + Math.random() * 10, 100);
			});
		}, 500);
		setTimer(tmpTimer);
		return () => {
			clearInterval(tmpTimer);
		};
	}, [file, error]);

	useEffect(() => {
		setLoadingMessage(UPLOAD_STATUS[loadingStatus]);
	}, [loadingStatus]);

	useEffect(() => {
		if (timer && (progress === 100 || loadingStatus === UPLOAD_STATUS_ENUM.Success || loadingStatus === UPLOAD_STATUS_ENUM.Error)) {
			clearInterval(timer);
			increaseUploadedCount();
		}
	}, [loadingStatus, progress]);

	return (
		<div style={{ width: '100%' }}>
			<StyledProgressBar>
				<StyledProgressText>
					<Typography variant='body1' sx={{ color, fontWeight: 600, fontSize: '14px' }}>
						{file?.name}
					</Typography>
					<StyledMeta sx={{ color: loadingStatus === UPLOAD_STATUS_ENUM.Error ? '#FF3C5D' : '#1E202B' }}>
						<Typography variant='body2' sx={{ fontSize: 'inherit' }}>
							{fData(file?.size || 0)}
						</Typography>
						<Typography variant='body2' sx={{ fontSize: 'inherit' }}>
							•
						</Typography>
						<Typography variant='body2' sx={{ fontSize: 'inherit' }}>
							{loadingMessage}{error ? `: ${error.message}` : ''}
						</Typography>
					</StyledMeta>
				</StyledProgressText>
				<StyledProgressButton>
					{loadingStatus === UPLOAD_STATUS_ENUM.Success && <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />}
					{loadingStatus === UPLOAD_STATUS_ENUM.Error && <WarningAmberRounded sx={{ color }} />}
					{![UPLOAD_STATUS_ENUM.Success, UPLOAD_STATUS_ENUM.Error].includes(loadingStatus) &&
						<IconButton edge='end' size='small' onClick={() => onRemoveFile(fileId)}>
							<CloseIcon />
						</IconButton>
					}
				</StyledProgressButton>
			</StyledProgressBar>
			<LinearProgress
				sx={{
					margin: '4px 0px',
					backgroundColor: loadingStatus === UPLOAD_STATUS_ENUM.Error ? '#FFE0D8' : '#E3C7F9',
					'& > .MuiLinearProgress-bar': {
						backgroundColor: loadingStatus === UPLOAD_STATUS_ENUM.Error ? '#FF8C8A' : '#9859E0',
					},
				}}
				value={progress}
				variant="determinate"
			/>
		</div>

	);
};

export default ProgressBar;
