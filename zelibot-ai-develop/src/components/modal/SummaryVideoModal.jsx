import { Box, Stack, IconButton } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MessagingLayout from '../../feature/video-messaging/layout';
import { Loading } from 'src/components/loading-screen';
import { Text22Weight700 } from '../common/TypographyStyled';

const CONTROL = {
	PLAY: 'PLAY',
	PAUSE: 'PAUSE',
};

const sec2Min = (sec) => {
	const min = Math.floor(sec / 60);
	const secRemain = Math.floor(sec % 60);
	return {
		min: min,
		sec: secRemain,
	};
};

const SummaryVideoModal = ({ onCloseModal, data }) => {
	const videoRef = useRef(null);
	const [loading, setLoading] = useState(true);

	const handleLoadedData = () => {
		setLoading(false);
		setPlaying(true);
	};
	const { recordingVideo, interview_transcript, title } = data;
	const [playing, setPlaying] = useState(false);
	// const [currentTime, setCurrentTime] = useState([0, 0]);
	const [currentTimeSec, setCurrentTimeSec] = useState(0);
	// const [duration, setDuration] = useState([0, 0]);
	const [durationSec, setDurationSec] = useState(0);

	useEffect(() => {
		const { min, sec } = sec2Min(videoRef?.current?.duration);
		setDurationSec(videoRef?.current?.duration);
		// setDuration([min, sec]);

		const interval = setInterval(() => {
			const { min, sec } = sec2Min(videoRef?.current?.currentTime);
			setCurrentTimeSec(videoRef?.current?.currentTime);
			// setCurrentTime([min, sec]);
		}, 1000);
		return () => clearInterval(interval);
	}, [playing]);

	const videoHandler = (control) => {
		if (control === CONTROL.PLAY) {
			videoRef.current.play();
			setPlaying(true);
		} else if (control === CONTROL.PAUSE) {
			videoRef.current.pause();
			setPlaying(false);
		}
	};
	const conversationInfo = useMemo(
		() => ({
			conversation: interview_transcript ?? [],
		}),
		[interview_transcript]
	);
	return (
		<MessagingLayout conversationInfo={conversationInfo} isPreScreeningScreen>
			<Box sx={{ position: 'relative', overflow: 'hidden', backgroundSize: 'cover', display: 'flex', justifyContent: 'center', height: '100%', width: '100% ' }}>
				{loading ? (
					<Box>
						<Loading />
					</Box>
				) : null}
				<video style={{ width: 'auto', height: 'auto', overflow: 'hidden', objectFit: 'cover' }} ref={videoRef} preload='auto' onLoadedData={handleLoadedData} autoPlay>
					<source src={recordingVideo ?? 'https://c6140bba-5c2d-4e7d-a82a-e7f61c4f4b4e.s3.ap-southeast-2.amazonaws.com/avatar/animation/HR/01/silence_60s.mp4'} type='video/mp4' />
					Your browser does not support the video tag.
				</video>
				<Stack sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} justifyContent='flex-end' alignItems='center'>
					<Stack sx={{ width: '90%', mb: 3 }} gap={2}>
						{title ? <Text22Weight700 sx={{ color: '#fff' }}>{title}</Text22Weight700> : null}
						<Stack direction='row' gap={2} sx={{ width: '100%' }}>
							<Stack direction='row' sx={{ flexGrow: 1, borderRadius: 2, background: 'rgba(255, 255, 255, 0.20)', p: 1 }} alignItems='center' gap={1}>
								<IconButton onClick={() => videoHandler(playing ? CONTROL.PAUSE : CONTROL.PLAY)}>{playing ? <PauseIcon style={{ color: '#fff' }} /> : <PlayArrowIcon style={{ color: '#fff' }} />}</IconButton>
								<input
									type='range'
									min='0'
									max={durationSec}
									default='0'
									value={currentTimeSec}
									style={{ flexGrow: 1, accentColor: '#FF3C5D' }}
									onChange={(e) => {
										videoRef.current.currentTime = e.target.value;
									}}
								/>
							</Stack>
							<Stack justifyContent='center' alignItems='center' sx={{ color: '#fff', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.20)', width: 140, cursor: 'pointer', display: { xs: 'block', md: 'none' } }} onClick={() => onCloseModal()}>
								Close
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Box>
		</MessagingLayout>
	);
};

export default SummaryVideoModal;
