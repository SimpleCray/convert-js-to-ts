import { Typography, Button, Stack } from '@mui/material';
import { VideoControlsContainer, PreviewVideoContainer } from './VideoAudioControlsStyles';
import { PreviewVideo } from 'amazon-chime-sdk-component-library-react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { MicSelection, SpeakerSelection, CameraSelection } from 'amazon-chime-sdk-component-library-react';

const VideoAudioControls = ({ onCloseModal, data }) => {



	const { handleMeetingJoin } = data;

	return (
		<>
			<VideoControlsContainer>
				<Typography variant='h4'>Get set up before you join.</Typography>

				<PreviewVideoContainer>
					<PreviewVideo />
				</PreviewVideoContainer>

				<Typography variant='body1'>You can change these setting below to your preferred options. Once you are done click I’m ready.</Typography>

				<Stack direction='row' spacing={4}>
					<div>
						<CameraSelection />
					</div>
					<div>
						<SpeakerSelection />
					</div>
					<div>
						<MicSelection />
					</div>
				</Stack>

				<Button
					variant='contained'
					color='primary'
					onClick={() => {
						onCloseModal();
						handleMeetingJoin();
					}}
				>
					I am ready
				</Button>
			</VideoControlsContainer>
		</>
	);
};

export default VideoAudioControls;
