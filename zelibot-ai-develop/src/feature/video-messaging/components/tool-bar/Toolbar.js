import { Button, Typography } from '@mui/material';
import { StyledToolbar, EndCallToolbarContainer, CenterContent, GreyButton } from './ToolbarStyles';
import { Iconify } from '@zelibot/zeligate-ui';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { styled } from '@mui/material/styles';
import { VideoTimeDisplay } from '../../../../components/video-time-display/VideoTimeDisplay.jsx';
import { CircularProgress } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';

export default function Toolbar({ conversationInfo, interviewStarted = false, onMeetingStartStopClick, interviewStartedDisabled = false, loading = false, loadingEndInterview = false, handleChangePage }) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const [timer, setTimer] = useState('00:00');

	const [candidateDetails, setCandidateDetails] = useState({});

	useEffect(() => {
		const candidateDetails = JSON.parse(window.sessionStorage.getItem('candidate_details'));
		// console.log('Candidate Details: ', candidateDetails);
		setCandidateDetails(candidateDetails);
	}, []);

	useEffect(() => {
		let intervalId;

		if (interviewStarted) {
			let seconds = 0;

			intervalId = setInterval(() => {
				seconds++;
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const secs = seconds % 60;

				if (hours > 0) {
					setTimer(`${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
				} else {
					setTimer(`${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
				}
			}, 1000);
		} else {
			setTimer('00:00');
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [interviewStarted]);

	const handleClickOpen = () => {
		setDialogOpen(true);
	};

	const handleClose = () => {
		setDialogOpen(false);
	};

	return (
		<StyledToolbar>
			{(candidateDetails?.job_title || candidateDetails?.company_name) && (
				<Typography variant='h5' sx={{ color: 'white', marginLeft: '10px', marginBottom: '24px' }}>
					Screening for {candidateDetails?.job_title || 'Job Title'} {candidateDetails?.company_name && <>at {candidateDetails?.company_name || 'Company'}</>}
				</Typography>
			)}
			<div>
				{!interviewStarted ? (
					<Stack direction='row' justifyContent='center'>
						<GreyButton onClick={onMeetingStartStopClick} disabled={interviewStartedDisabled}>
							{loading ? 'Starting' : 'Start interview'}
						</GreyButton>
					</Stack>
				) : (
					<EndCallToolbarContainer>
						<GreyButton
							className={conversationInfo?.activePage > 3 ? '' : 'hiddenButton'}
							onClick={() => {
								const nextPage = conversationInfo?.activePage - 1;
								handleChangePage(nextPage <= 1 ? 1 : nextPage);
							}}
							startIcon={<Iconify icon={'ic:arrow-back'} id='end-btn' />}
						>
							Previous
						</GreyButton>

						<CenterContent>
							<GreyButton endIcon={<Iconify icon={'ic:round-close'} id='end-btn' />} onClick={handleClickOpen}>
								End Interview
							</GreyButton>

							<VideoTimeDisplay time={timer} />
						</CenterContent>

						<GreyButton
							className={conversationInfo?.activePage < conversationInfo?.totalPages - 1 ? '' : 'hiddenButton'}
							onClick={() => {
								const nextPage = conversationInfo?.activePage + 1;
								handleChangePage(nextPage >= conversationInfo?.totalPages ? conversationInfo?.totalPages : nextPage);
							}}
							endIcon={<Iconify icon={'ic:arrow-forward'} id='end-btn' />}
						>
							Next
						</GreyButton>
					</EndCallToolbarContainer>
				)}

				<Dialog open={dialogOpen} onClose={handleClose} aria-labelledby='responsive-dialog-title'>
					<DialogContent>
						<DialogContentText sx={{ margin: '64px 8px 8px' }}>Are you sure you want to end the interview?</DialogContentText>
					</DialogContent>
					<DialogActions sx={{ justifyContent: 'center' }}>
						<Stack direction='row' spacing={2}>
							<Button disabled={loadingEndInterview} variant={'contained'} color={'primary'} onClick={handleClose} autoFocus>
								NO
							</Button>

							<Button disabled={loadingEndInterview} variant={'outlined'} color={'primary'} onClick={onMeetingStartStopClick} autoFocus>
								{loadingEndInterview ? <CircularProgress /> : 'Yes'}
							</Button>
						</Stack>
					</DialogActions>
				</Dialog>
			</div>
		</StyledToolbar>
	);
}
