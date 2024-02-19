import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { EndScreenContainer, HighlightText } from './EndScreenStyles';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { sendTranscriptToEmail } from '../../../../constants';
import { LoadingButton } from '@mui/lab';



export default function EndScreen() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [candidateDetails, setCandidateDetails] = useState({});
	const [loading, setLoading] = useState(false);

	const handleClickOpen = () => {
		setDialogOpen(true);
	};

	const handleClose = () => {
		setDialogOpen(false);
	};

	const handleSendTranscript = async () => {
		setLoading(true)
		try {
			await sendTranscriptToEmail(candidateDetails.pk);
			handleClickOpen()
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const candidateDetails = JSON.parse(window.sessionStorage.getItem('candidate_details'));
		// console.log('Candidate Details: ', candidateDetails);
		setCandidateDetails(candidateDetails);
	}, []);

	const messageThankYou = () => {
		return (
		<Typography variant="h4">
			Thank you for your time,{' '}
			<Typography
				component={'b'}
				variant="h4"
				sx={{ fontWeight: '700', color: '#9859E0' }}
			>
				{candidateDetails?.candidate_name || "Candidate Surname"}
			</Typography>
			.
		</Typography>
		);
	};

	const messageBestWishes = () => {
		/**** Dummy data for testing purposes: *********/
		// const candidateDetails = { job_title: "Job title", company_name: "Company name" };
		// const candidateDetails = { company_name: "Company name" };
		// const candidateDetails = { job_title: "Job title" };
		/**************************************************/
	
		return (
			<Typography>
				We wish you all the best
				{candidateDetails?.job_title && (
				<>
					{' '}
					for the position of{' '}
					<Typography component={'span'} sx={{ fontWeight: '700', color: '#9859E0' }}>
					{candidateDetails.job_title}
					</Typography>
				</>
				)}
				{candidateDetails?.company_name && (
				<>
					{' '}
					at{' '}
					<Typography component={'span'} sx={{ fontWeight: '700', color: '#9859E0' }}>
						{candidateDetails.company_name}
					</Typography>
					</>
				)}
				.<br/>We will be in touch once all candidates have been screened.
			</Typography>
		);
	};

	// Function to generate the request for transcript email
	const messageTranscript = () => {
		return (
		<Typography>
			If you would like the transcript from this interview emailed to you,<br/>
			just click the button below.
		</Typography>
		);
	};

	return (
		<>
		<EndScreenContainer>
			{messageThankYou()}
			{messageBestWishes()}
			{messageTranscript()}
			<div>
			<LoadingButton variant={'contained'} color={'primary'} loading={loading} onClick={handleSendTranscript}>
				Send transcript
			</LoadingButton>
			</div>
		</EndScreenContainer>
		<div>
			<Dialog
				open={dialogOpen}
				onClose={handleClose}
				aria-labelledby="responsive-dialog-title"
			>
			<DialogContent>
				<DialogContentText sx={{ margin: '64px 8px 8px' }}>
					The transcript has been sent to {
						candidateDetails.candidate_email ? <Typography component={'span'} sx={{ color: '#9859E0' }}>
						{candidateDetails.candidate_email || ''}
					</Typography> : ' your email'
					}
					.
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ justifyContent: 'center' }}>
				<Button variant={'contained'} color={'primary'} onClick={handleClose} autoFocus>
					OK
				</Button>
			</DialogActions>
			</Dialog>
		</div>
		</>
	);
}
