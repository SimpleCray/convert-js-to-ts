import { StyledAIAvatar, StyledAIAvatarImage, StyledAIAvatarVideo } from './AIAvatarStyles';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAIWorkerContext } from '../../AIWorker';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export function AIAvatar({
	selectedAssistant,
	speaking = false,
	color,
	hasActions = false,
	type = 'video',
	avatar,
	canPlay,
	enableZoom = false,
	setSpeaking,
	isListening,
	width = 160, // Default width
	height = 160, // Default height
	borderRadius = '100%', // Circular by default
	showBorder = true,
	filterVideoExecutionQueue,
	videoExecutionQueue,
	muted,
	...props
}) {
	const AIContext = useAIWorkerContext();
	const videoRef = useRef();
	const videoId = uuidv4();
	// Note Safari Issue ZEL-1039: Each browser may handle dynamic updates to video elements differently. Safari might have specific quirks or behaviors that lead to this visual effect during the transition between video sources.
	// To address this issue, the suggestions mentioned in the previous response—such as using the key prop, unmounting/remounting the component, or forcing a re-render—aim to help React and the browser handle the video element update more gracefully.
	const [keyId, setKeyId] = React.useState(0);
	const selectedAssistantId = selectedAssistant?.id || '01';
	const [autoplayAllowed, setAutoplayAllowed] = useState(true);
	const playbackIntervalRef = useRef(null);

	const playVideo = useCallback(
		({ isIdle, url }) => {
			// console.log('Running the play video function')
			if (isIdle || !url) {
				videoRef.current.src = AIAvatarVideoFile_v2('silence_60s.mp4', selectedAssistantId);
			} else {
				videoRef.current.src = AIAvatarVideoFile_v2(url, selectedAssistantId);
			}
			let promise = videoRef.current?.play();
			if (promise !== undefined) {
				promise.then(_ => {
					// Autoplay started!
					// setMutedState(false)
					setAutoplayAllowed(true)
					// setMutedState(false)
				}).catch(error => {
					// Autoplay was prevented.
					// Show a "Play" button so that user can start playback.
					// setMutedState(true)
					setAutoplayAllowed(false)
				});
			}
		},
		[selectedAssistantId]
	);

	useEffect(() => {
		if (!autoplayAllowed) {
			// console.log('Starting the playback interval to keep checking for user interaction', playbackIntervalRef.current);
			playbackIntervalRef.current = setInterval(() => {
				playVideo({ isIdle: true });
			}, 5000);
			// console.log('Playback interval after setting it is ', playbackIntervalRef.current);
		} else {
			// console.log('Clearing the playback interval', playbackIntervalRef.current);
			AIContext?.clearVideoExecutionQueue();
			clearInterval(playbackIntervalRef.current);
		}

		// Cleanup interval on component unmount
		return () => {
			clearInterval(playbackIntervalRef.current);
		};
	}, [autoplayAllowed]);

	// Handle autoplay video, muted by default (for Chrome) but unmute on load
	useEffect(() => {
		let myTimeOut;
		if (videoRef.current) {
			if (isListening) {
				// ZK-147 speech recognition and Avatar speed should never be the overlap
				playVideo({ isIdle: true });
				AIContext?.clearVideoExecutionQueue();
				return;
			}
			// // Needs to play regardless, else the default avatar will be visible
			playVideo({ url: avatar?.url });
			// videoRef.current.muted = false;
			if (!videoRef.current?.src.includes('silence_60s.mp4')) {
				// on video end play silence video
				videoRef.current.onended = function () {
					if (avatar.id && videoExecutionQueue) {
						filterVideoExecutionQueue(avatar?.id);
					}
					if (videoExecutionQueue?.length === 0 || !videoExecutionQueue) {
						if (isSafari) {
							// READ THE NOTE ABOVE ZEL-1039
							setKeyId((prev) => prev + 1);
							myTimeOut = setTimeout(() => {
								playVideo({ isIdle: true });
							}, 400);
						} else {
							playVideo({ isIdle: true });
						}
					}
				};
			}
		}
		return () => {
			clearTimeout(myTimeOut);
		};
	}, [videoRef, avatar, selectedAssistantId, canPlay, isListening]);

	// Function to get zoom settings based on selected assistant ID:
	const getZoomSettings = (assistantId) => {
		// Don't scale by default:
		let settings = { scale: '1', translateX: '0px', translateY: '0px' };

		if (enableZoom) {
			// prettier-ignore
			// When zoom enabled, scale with specific settings for each personality:
			switch (assistantId) {
				case '01': settings = { scale: '1.7', translateX: '-2px', translateY: '25px' }; break;
				case '02': settings = { scale: '1.7', translateX: '0px', translateY: '15px' }; break;
				case '03': settings = { scale: '2', translateX: '0px', translateY: '25px' }; break;
				case '04': settings = { scale: '1.4', translateX: '-3.5px', translateY: '18px' }; break;
				case '05': settings = { scale: '2', translateX: '0px', translateY: '25px' }; break;
				case '06': settings = { scale: '2.6', translateX: '2px', translateY: '30px' }; break;
			}
		}

		return {
			transform: `scale(${settings.scale}) translateX(${settings.translateX}) translateY(${settings.translateY})`,
		};
	};

	// Keep track of whether the avatar is speaking or not:
	useEffect(() => {
		const updateSpeakingState = () => {
			const isAvatarSilent = avatar?.url?.includes('silence_60s.mp4');
			const isVideoRefSilent = videoRef?.current?.src?.includes('silence_60s.mp4');
			const speakingVideoLoaded = avatar?.url && !(isAvatarSilent || isVideoRefSilent);

			setSpeaking(speakingVideoLoaded);
			// console.log(`[VC] isAvatarSpeaking: ${speakingVideoLoaded}, avatarSpeaking: ${speakingVideoLoaded}`);
		};

		videoRef.current?.addEventListener('play', updateSpeakingState);

		return () => {
			videoRef.current?.removeEventListener('play', updateSpeakingState);
		};
	}, [avatar]);

	const zoomSettings = getZoomSettings(selectedAssistantId);
	const avatarImageUrl = AIAvatarImage(selectedAssistantId);
	const avatarWatermarkCoverUpImageUrl = AIAvatarWatermarkCoverUpImage(selectedAssistantId);

	return (
		<StyledAIAvatar id={videoId} width={width} height={height} borderRadius={borderRadius} className={`ai-avatar${speaking ? ' speaking' : ''}${hasActions ? ' has-actions' : ''}`} color={color} showBorder={showBorder} {...props}>
			<StyledAIAvatarImage src={avatarImageUrl} alt='Avatar Background' style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0, objectFit: 'cover' }} sx={zoomSettings} />
			{type === 'video' && (
				<StyledAIAvatarVideo key={`${avatar?.id}_${keyId}`} ref={videoRef} autoplay loop={!!avatar?.url?.includes('silence_60s.mp4')} muted={muted} style={{ objectFit: 'cover' }} sx={getZoomSettings(selectedAssistantId)}>
					<source src={avatar?.url?.includes('silence_60s.mp4') || !canPlay ? AIAvatarVideoFile_v2('silence_60s.mp4', selectedAssistantId) : AIAvatarVideoFile_v2(avatar?.url, selectedAssistantId)} style={zoomSettings} type='video/mp4' />
				</StyledAIAvatarVideo>
			)}

			<StyledAIAvatarImage src={avatarWatermarkCoverUpImageUrl} alt='Avatar watermark cover-up' style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0, objectFit: 'cover' }} sx={zoomSettings} onDragStart={(e) => e.preventDefault()} />
		</StyledAIAvatar>
	);
}

// Background still image of the selected AI Helper avatar:
function AIAvatarImage(selectedAssistantId) {
	return `https://c6140bba-5c2d-4e7d-a82a-e7f61c4f4b4e.s3.ap-southeast-2.amazonaws.com/avatar/animation/HR/${selectedAssistantId}/bg.png`;
}

// Video animations for the selected AI Helper avatar:
export function AIAvatarVideoFile_v2(url, selectedAssistantId) {
	// -------------------------------------------------------------------------------------------------------------------------
	// *** HACK ALERT ***
	// NOTE: This can now handle both full URLs and url only containing file name -- it's taking just the filename from the URL.
	// We should probably make it so the base path is received separately from the back end so we can robustly construct the full
	// video and image path names from the base url, assistanct ID, and file name.
	// -------------------------------------------------------------------------------------------------------------------------
	let fileName;
	try {
		// Try to extract the file name from a full URL
		const urlObj = new URL(url);
		fileName = urlObj.pathname.split('/').pop(); // Extracts the last segment of the pathname
	} catch (e) {
		// If URL parsing fails, assume the input is already just a file name
		fileName = url;
	}

	return `https://c6140bba-5c2d-4e7d-a82a-e7f61c4f4b4e.s3.ap-southeast-2.amazonaws.com/avatar/animation/HR/${selectedAssistantId}/${fileName}`;
}

// Foreground watermark cover-up image for the seelcted AI Helper avatar:
function AIAvatarWatermarkCoverUpImage(selectedAssistantId) {
	return `https://c6140bba-5c2d-4e7d-a82a-e7f61c4f4b4e.s3.ap-southeast-2.amazonaws.com/avatar/animation/HR/${selectedAssistantId}/awcu.png`;
}
