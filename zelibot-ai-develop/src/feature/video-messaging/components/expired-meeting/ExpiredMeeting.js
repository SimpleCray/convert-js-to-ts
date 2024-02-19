import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { ExpiredMeetingContainer } from './ExpiredMeetingStyles'



export default function ExpiredMeeting() {

    const [candidateDetails, setCandidateDetails] = useState({});


    useEffect(() => {
		const candidateDetails = JSON.parse(window.sessionStorage.getItem('candidate_details'));
		// console.log('Candidate Details: ', candidateDetails);
		setCandidateDetails(candidateDetails);
	}, []);

    return (
        <>
            <ExpiredMeetingContainer>
                <Typography variant="h4">
                    The interview link for <Typography component={'span'} variant="h4" sx={{ fontWeight: '700', color: '#9859E0' }}>
					{candidateDetails?.job_title || 'Job Title'}
					</Typography> {candidateDetails?.company_name && (
				<>
					{' '}
					at{' '}
					<Typography component={'span'} variant="h4" sx={{ fontWeight: '700', color: '#9859E0' }}>
						{candidateDetails?.company_name || 'Company Name'}
					</Typography>
					</>
				)} has expired.
                </Typography>

                <p>
                    Kindly respond to the initial email you received to request a new link.
                </p>
            </ExpiredMeetingContainer>

        </>
    );
}
