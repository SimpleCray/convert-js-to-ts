import MessagingLayout from './layout';
import Toolbar from './components/tool-bar';
import EndScreen from './components/end-screen';
import { useEffect, useState, useRef, useMemo } from 'react';
import { DeviceLabels, MeetingStatus, useAudioVideo, useLocalVideo, useMeetingManager, useMeetingStatus } from 'amazon-chime-sdk-component-library-react';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';
import { getEndMeeting, getAIQuestions, getMeetingWithAtendee, checkIfMeetingCanBeStarted } from '../../constants';
import { AIAvatar } from '../ai-worker/components';
import { getSelectedAssistantId } from 'src/feature/ai-worker/constants';
import { v4 as uuidv4 } from 'uuid';
import { VideoTileGrid } from 'amazon-chime-sdk-component-library-react';
import { StyledVideoGridWrapper } from './VideoMessagingStyles';
import Backdrop from '@mui/material/Backdrop';
import ExpiredMeeting from './components/expired-meeting/ExpiredMeeting';
import AlertDialog from '../../components/dialog/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import useModal, { MODAL_TYPES } from '../../hooks/useModal';
import { useAudioInputs, useVideoInputs, useAudioOutputs } from 'amazon-chime-sdk-component-library-react';


export const CONVERSATION_TYPE = {
	USER: 'USER',
	AI: 'AI',
};

export default function VideoMessaging() {
	const meetingManager = useMeetingManager();
	const meetingStatus = useMeetingStatus();
	const audioVideo = useAudioVideo();
	const audioInput = useAudioInputs();
	const audioOutput = useAudioOutputs();
	const videoInput = useVideoInputs();



	const { toggleVideo } = useLocalVideo();
	const [conversationInfo, setConversationInfo] = useState({
		totalPages: 0,
		activePage: 0,
		conversation: [] /* type, text, videoUrl?, page? */,
	});

	const [loading, setLoading] = useState(false);
	const [loadingEndInterview, setLoadingEndInterview] = useState(false);
	const [meetingEnded, setMeetingEnded] = useState(false);

	const [meetingId, setMeetingId] = useState(null);
	const [meeting, setMeeting] = useState({});
	const [attendeeId, setAttendeeId] = useState('');
	const [transcripts, setTranscripts] = useState([]);

	const timerStartSpeechRef = useRef(null);
	const timeoutStartSpeech = 10000; // 10 seconds
	const timerEndSpeechRef = useRef(null);
	const timeoutEndSpeech = 4000; // 4 seconds

	const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
	const [recResultTranscript, setRecResultTranscript] = useState('');

	const speechToTextRef = useRef();
	const chatPanelRef = useRef(null);

	const [stateShouldUpdate, setStateShouldUpdate] = useState(true);
	const [selectedAssistant, setSelectedAssistant] = useState({ id: '00', name: 'Zeli', role: 'HR Specialist' });

	const [inviteToken, setInviteToken] = useState('');
	const [initializing, setInitializing] = useState(false);

	const [interviewCompleted, setInterviewCompleted] = useState(false);
	const [meetingExpired, setMeetingExpired] = useState(false);

	const [preScreeningInterviewId, setPreScreeningInterviewId] = useState('');
	const [sk, setSk] = useState('');

	const [videoLoading, setVideoLoading] = useState('');

	const { renderModal, setOpenModal } = useModal({
		showCloseButton: false,
		additionalStyles: {
			maxWidth: '80dvw',
			p: 0,
			borderRadius: 2,
		},
		closeWhenClickedOutside: false
	});

	// ----------------------------------------------------------------------------
	// Handle setting the selected assistant:

	useEffect(() => {
		if (stateShouldUpdate) {
			getSelectedAssistantId().then((response) => {
				setSelectedAssistant({
					id: '0' + response?.data[0]?.assistant_id ?? 1, // < Defaults to 01
					name: 'Zeli',
					role: 'HR Helper',
				});
				setStateShouldUpdate(false);
				// setAvatar({ id: uuidv4(), url: 'silence_60s.mp4', loop: true });
			});
		}
	}, [stateShouldUpdate]);

	// ----------------------------------------------------------------------------
	// Managing the avatar object -- which triggers new videos to load in AIAvatar:

	const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

	// Update currentVideoUrl when the conversationInfo changes:
	useEffect(() => {
		const currentConversation = conversationInfo?.conversation?.find((item) => item.page === conversationInfo?.activePage);
		if (currentConversation) {
			const newUrl = currentConversation?.videoUrl ?? '';
			if (newUrl !== currentVideoUrl) {
				console.log(`[VC] setting new current video url: ${currentVideoUrl}`);
				setCurrentVideoUrl(newUrl);
			}
		}
	}, [conversationInfo]);

	const PromptType = {
		INITIAL: 'initial', // Default state when playing AIAvatar message
		TIMEOUT1: 'timeout1', // Playing AIAvatar message because user did not respond to initial prompt
		TIMEOUT2: 'timeout2', // Playing AIAvatar message because user did not respond to timeout1 prompt
	};

	const [currentPromptType, setCurrentPromptType] = useState(PromptType.INITIAL);

	// Set avatar when the currentVideoUrl or currentPromptTypeis updated:
	const avatar = useMemo(() => {
		// Note: upon a URL change it's always an 'initial' prompt type by default.
		if (currentVideoUrl !== null) {
			return { id: uuidv4(), url: currentVideoUrl, type: currentPromptType };
		}
		return { id: uuidv4(), url: 'silence_60s.mp4', type: PromptType.INITIAL };
	}, [currentVideoUrl, currentPromptType]);

	// Function to update the avatar prompt type:
	const updateAvatarPromptType = (currentAvatar, newPromptType) => {
		return setAvatar({ ...currentAvatar, type: newPromptType });
	};

	// ----------------------------------------------------------------------------
	// Interview UX:

	// Delay the intro message by a couple of seconds:
	const [canPlayIntro, setCanPlayIntro] = useState(false);
	const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
	useEffect(() => {
		// Delay intro message for 3 seconds:
		const blockTimer = setTimeout(() => {
			setCanPlayIntro(true);
		}, 3000);

		setInitializing(true);

		// Ensure intro message is played after 4 seconds if not already called:
		const callTimer = setTimeout(() => {
			if (!hasIntroPlayed) {
				handleChangePage(1);
				setHasIntroPlayed(true);
			}
		}, 4000);

		return () => {
			clearTimeout(blockTimer);
			clearTimeout(callTimer);
		};
	}, []);

	useEffect(() => {
		setInitializing(true);

		if (canPlayIntro && !hasIntroPlayed) {
			handleChangePage(1);
			setHasIntroPlayed(true);
		}
	}, [canPlayIntro, hasIntroPlayed]);

	const [userSpeechResponseStartTime, setUserSpeechResponseStartTime] = useState(null);
	const handleChangePage = (activePage) => {
		// Only start the first page when we can play the intro and it has not played yet:
		if (activePage == 1 && (!canPlayIntro || hasIntroPlayed)) return;

		// console.log(`[VC] handleChangePage -- activePage: ${activePage}, conversationInfo.activePage: ${conversationInfo.activePage}`);

		// Do not reload current page ever when already on it
		// (this avoids timeouts triggering same page again
		// when user happened to have just clicked the Next button):
		if (activePage == conversationInfo?.activePage) {
			// console.log(`[VC] Cancelling handleChangePage because we are already on this page -- activePage: ${activePage}, conversationInfo?.activePage: ${conversationInfo?.activePage}`);
			return;
		}

		// If going past the last page, then end the interview:
		if (activePage > conversationInfo?.totalPages && conversationInfo?.totalPages > 0) {
			// console.log(`[VC] Ending interview because activePage is past last page -- activePage: ${activePage}, conversationInfo?.activePage: ${conversationInfo?.activePage}, conversationInfo?.totalPages: ${conversationInfo?.totalPages}`);
			handleMeetingEnd();
		}

		// console.log(`[VC] -------- CHANGE PAGE: ${activePage} ---------------------------------------------------------------------`)
		setHasIntroPlayed(true);
		setCurrentPromptType(PromptType.INITIAL); // Upon new question: first avatar speech is Initial prompt
		handleAIQuestions(activePage, conversationInfo.conversation);
	};

	const reloadCurrentPage = (activePage) => {
		// TODO: show a "..." user message in the chat to indicate they did not respond?

		setCurrentPromptType(PromptType.TIMEOUT1); // Upon repeating question: avatar speech is first timeout
		handleAIQuestions(activePage, conversationInfo.conversation); // and show that in the chat again as well
	};

	const handleGetMeetingWithAtendees = async (inviteToken) => {
		return await getMeetingWithAtendee(inviteToken).then((guid) => {
			setAttendeeId(guid);
			return guid;
		});
	};

	const handleAIQuestions = async (page_number = 1, conversations) => {
		const body = {
			page_number: page_number,
			conversations: conversations,
			pre_screening_interview_id: preScreeningInterviewId,
			sk: sk,
		};

		if (page_number === 2) {
			setLoading(true)
		}

		const resp = await getAIQuestions(body);
		if (resp) {
			if (resp.status === 'SUCCESS') {
				const newZeliText = resp?.avatar_dialog;
				const newtotalPages = resp?.last_page ?? conversationInfo?.totalPages;
				const videoUrl = resp?.video_url ?? '';
				setConversationInfo((prevState) => ({
					...prevState,
					totalPages: newtotalPages,
					activePage: page_number,
					conversation: [
						...prevState.conversation,
						{
							time: new Date(Date.now()).toUTCString(),
							type: CONVERSATION_TYPE.AI,
							text: newZeliText,
							videoUrl,
							page: page_number,
						},
					],
				}));
			} else if (resp?.status === 'EXPIRED') {
				setMeetingExpired(true);
				setConversationInfo({
					totalPages: 0,
					activePage: 0,
					conversation: [
						{
							time: new Date(Date.now()).toUTCString(),
							type: CONVERSATION_TYPE.AI,
							text: 'The interview link has expired. Kindly respond to the initial email you received to request a new link.',
							videoUrl: '',
							page: 1,
						},
					],
				});
			} else if (resp?.status === 'COMPLETED') {
				setInterviewCompleted(true);
				setMeetingEnded(true);
			}
			setInitializing(false);
			if (page_number === 2) {
				setLoading(false)
			}
		}
	};

	const handleEndMeeting = async () => {
		try {
			setLoadingEndInterview(true);
			await getEndMeeting({
				meetingId: meeting?.MeetingId,
			});
			localStorage.removeItem('meeting');
			setMeeting({});
			setMeetingId(null);
			setMeetingEnded(true);
		} catch (err) {
			setLoadingEndInterview(false);
		} finally {
			setLoadingEndInterview(false);
		}
	};

	useEffect(() => {
		const candidateDetails = JSON.parse(window.sessionStorage.getItem('candidate_details'));
		const inviteToken = candidateDetails?.pk || '';
		setInviteToken(inviteToken);
		setPreScreeningInterviewId(candidateDetails?.pre_screening_interview_id);
		setSk(candidateDetails?.sk);
	}, []);

	useEffect(() => {
		// console.log('[VC] conversationInfo updated:', conversationInfo);
	}, [conversationInfo]);

	const checkIfMeetingHasStarted = async (meetingID) => {
		setLoading(true);
		try {
			const resp = await checkIfMeetingCanBeStarted(meetingID);
			setLoading(false);
			return resp;
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleMeetingJoin = async () => {
		setMeetingId('1');
		setAttendeeId('2');
		setLoading(true);
		try {
			const joinResponse = await handleGetMeetingWithAtendees(inviteToken);

			if (joinResponse?.status === 'CREATED') {
				await setMeeting({
					message: joinResponse?.message,
					MeetingId: joinResponse?.MeetingId,
					externalMeetingId: joinResponse?.externalMeetingId,
					meetingInfo: joinResponse?.meetingInfo,
				});

				const meetingSessionConfiguration = new MeetingSessionConfiguration(joinResponse?.meetingInfo, joinResponse?.attendeeInfo?.Attendee);

				await meetingManager.join(meetingSessionConfiguration);


				// const options = {
				// 	deviceLabels: DeviceLabels.AudioAndVideo,
				// };


				await setMeetingId(meeting?.MeetingId);
				setAttendeeId(joinResponse.attendeeInfo?.Attendee?.AttendeeId);

				openPreviewVideoModal();

			} else if (joinResponse?.status === 'EXPIRED') {
				showExpiredMeeting()
			} else if (joinResponse?.status === 'COMPLETED') {
				setInterviewCompleted(true);
				setMeetingEnded(true);
			}
		} catch (err) {
			// console.log(`[VC] ${err}`);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	const startMeeting = async () => {
		setLoading(true);
		// meetingManager.selectedAudioInputDevice = audioInput 
        await meetingManager.selectVideoInputDevice(videoInput);
        await meetingManager.audioVideo.chooseAudioOutput(audioOutput)

		// await meetingManager.join(meetingSessionConfiguration);

		await meetingManager.start();
		setLoading(false);
	};

	const showExpiredMeeting = () => {
		setMeetingExpired(true);
		setConversationInfo({
			totalPages: 0,
			activePage: 0,
			conversation: [
				{
					time: new Date(Date.now()).toUTCString(),
					type: CONVERSATION_TYPE.AI,
					text: 'The interview link has expired. Kindly respond to the initial email you received to request a new link.',
					videoUrl: '',
					page: 1,
				},
			],
		});
	}

	const handleMeetingEnd = async () => {
		void handleEndMeeting();
	};

	useEffect(() => {
		async function tog() {
			setVideoLoading(true);
			if (meetingStatus === MeetingStatus.Succeeded) {
				try {
					await toggleVideo();
					setVideoLoading(false);
					let videoRecording;
					videoRecording = await checkIfMeetingHasStarted(inviteToken);

					if (videoRecording.status === 'SUCCESS' || videoRecording.status === 'ALREADY_STARTED') {
						handleChangePage(2);
					}
				} catch (err) {
					console.error(err);
					setVideoLoading(false);
				}
			}
		}
		void tog();
	}, [meetingStatus]);

	// Handle all transcription events
	useEffect(() => {
		if (audioVideo) {
			audioVideo.transcriptionController?.subscribeToTranscriptEvent((transcriptEvent) => {
				// console.log(`[VC] #116 Transcript Event: ${JSON.stringify(transcriptEvent)}`);
				setTranscripts(transcriptEvent);
			});
		}
	}, [audioVideo]);

	// ------------------------------------------------------------------------
	// Process rec-results coming back from AWS:

	const startTimeForTimerEndSpeechRef = useRef(Date.now()); // <- for debugging only

	useEffect(() => {
		if (transcripts && transcripts.results !== undefined) {
			const currentResult = transcripts.results[0];
			const transcriptText = currentResult.alternatives[0].transcript;
			const currentResultId = currentResult.resultId;

			// /* For debugging only: ******/
			// New result received, so calculate new elapsedTime and update the start time:		// <- for debugging only
			// const elapsedTime = Date.now() - startTimeForTimerEndSpeechRef.current;				// <- for debugging only
			// startTimeForTimerEndSpeechRef.current = Date.now();									// <- for debugging only
			// console.log(`[VC] REC RESULT after ${elapsedTime} ms >> ${currentResult.isPartial ? "PARTIAL" : "FINAL"} transcript: \"${transcriptText}\"`);
			// /************************/

			// Update the conversation info with the new recognition result:
			if (transcriptText.trim() !== '') {
				// If we receive any rec result, then stop both the start- and end-of-speech timers:
				if (timerStartSpeechRef.current) {
					// console.log(`[VC] START-OF-SPEECH TIMER STOP ${timerStartSpeechRef.current}`);
					clearTimeout(timerStartSpeechRef.current);
				}
				resetSpeechStartTimeoutCounter(); // < speech start timeout counter back to 0...
				if (timerEndSpeechRef.current) {
					// console.log(`[VC] END-OF-SPEECH TIMER STOP ${timerEndSpeechRef.current}`);
					clearTimeout(timerEndSpeechRef.current);
				}

				setRecResultTranscript((previousRecResult) => {
					// Check if the current resultId is different from the previous one
					if (currentResultId !== previousRecResult.resultId) {
						// console.log(`[VC] CREATE NEW MESSAGE: ${currentResultId}: ${transcriptText}`);
						// Set user response timestamp to first rec result after page change:
						if (!userSpeechResponseStartTime) {
							setUserSpeechResponseStartTime(new Date().toUTCString());
						}

						// Only create new entry to conversation if there is actual speech:
						if (transcriptText && transcriptText != '') {
							setConversationInfo((prevState) => ({
								...prevState,
								activePage: prevState.activePage, // Retain the current activePage value
								conversation: [
									...prevState?.conversation,
									{
										time: userSpeechResponseStartTime,
										type: CONVERSATION_TYPE.USER,
										text: transcriptText,
										id: currentResultId,
									},
								],
							}));
						}
					} else {
						// console.log(`[VC] OVERRIDE EXISTING MESSAGE: ${currentResultId}: ${transcriptText}`);
						// This is an updated rec result for a pre-existing entry, so replace it:
						setConversationInfo((prevState) => ({
							...prevState,
							activePage: prevState.activePage, // Retain the current activePage value
							conversation: prevState.conversation.map((entry) =>
								entry.id === currentResultId
									? {
											...entry,
											time: userSpeechResponseStartTime,
											type: CONVERSATION_TYPE.USER,
											text: transcriptText,
											id: currentResultId,
										}
									: entry
							),
						}));
					}

					return { transcript: transcriptText, resultId: currentResultId };
				});
			}

			// If we just processed a FINAL result, then do some book-keeping:
			// - clear the user response time stamp, so we can set a new one for the next result
			// - start the end-of-speech timer ( but only if the AIAvatar is not currently speaking)
			if (!transcripts.results[0].isPartial) {
				// console.log(`[VC] TIMER START  ${timerEndSpeechRef.current} >> timerEndSpeech -- FINAL rec result received`);
				// Clear user response time, so we can set new one when new user response starts coming in:
				setUserSpeechResponseStartTime(null);

				if (!isAvatarSpeaking) {
					timerEndSpeechRef.current = setTimeout(() => {
						// If that end-of-speech timer expires before we receive another rec result,
						// then we automatically progress to the next page (i.e. question):

						// const elapsedTime = Date.now() - startTimeForTimerEndSpeechRef.current;				// <- for debugging only
						// console.log(`[VC] TIMER TIMEOUT  ${timerEndSpeechRef.current} >> No user speech for ${elapsedTime} ms (timout was set to ${timeoutEndSpeech} ms, so going to auto-progress to next question.`)

						handleChangePage(conversationInfo?.activePage + 1);
					}, timeoutEndSpeech); // Assuming timeoutEndSpeech is defined as timout duration in milliseconds
				}
			}
		}
	}, [transcripts]);

	// ------------------------------------------------------------------------
	// Beginning-of-Speech Timeout Handling:
	//
	// - When avatar stops speaking, wait max of 10 seconds for user to speak
	// - If user does not speak within 10 seconds, then repeat the last question
	// - If played a question twice and user still does not respond, go to next question
	//
	// TODO: May need some standard additional animations: "I didn't hear you.", "I still didn't hear you."

	const startTimeForTimerStartSpeechRef = useRef(Date.now()); // < for debugging only

	const speechStartTimeoutCounterRef = useRef(0); // < Default: 0

	// Method to increment speechStartTimeoutCounter by 1:
	const incrementSpeechStartTimeoutCounter = () => {
		speechStartTimeoutCounterRef.current += 1;
		// console.log(`[VC] speechStartTimeoutCounterRef.current incremented to ${speechStartTimeoutCounterRef.current}`);
	};

	// Method to reset speechStartTimeoutCounter back to 0:
	const resetSpeechStartTimeoutCounter = () => {
		speechStartTimeoutCounterRef.current = 0;
		// console.log(`[VC] speechStartTimeoutCounterRef.current reset to ${speechStartTimeoutCounterRef.current}`);
	};

	useEffect(() => {
		// Perform actions that depend on the updated state value
		if (isAvatarSpeaking) {
			// console.log(`[VC] VideoMessaging ==> AIAvatar STARTED speaking`);

			// Avatar started speaking, so no need to track yet how long it takes for candidate to respond:
			if (timerStartSpeechRef.current) {
				clearTimeout(timerStartSpeechRef.current);
				// console.log(`[VC] START-OF-SPEECH TIMER STOPPED: ${timerStartSpeechRef.current}`);
			}
		} else {
			// console.log(`[VC] VideoMessaging ==> AIAvatar STOPPED speaking -- conversationInfo?.activePage: ${conversationInfo?.activePage}, speechStartTimeoutCounterRef.current: ${speechStartTimeoutCounterRef.current}`);

			if (conversationInfo?.activePage > 1) {
				startTimeForTimerStartSpeechRef.current = Date.now(); // <-- for debugging only

				// Avatar stopped speaking, so start timing how long it takes for the candidate to respond:
				// (Note: shorter timeout before first question and at very end of interview)
				const timeoutDuration = conversationInfo?.activePage < 3 || conversationInfo?.activePage == conversationInfo?.totalPages - 1 ? 2000 : timeoutStartSpeech;

				// console.log(`[VC] Now going to increment the speech start timeout counter`);
				timerStartSpeechRef.current = setTimeout(() => {
					// If that start-of-speech timer expires before we receive another rec result,
					// then (a) reprompt if first time, or (b) move to next question when second time:

					incrementSpeechStartTimeoutCounter();
					const elapsedTime = Date.now() - startTimeForTimerStartSpeechRef.current; // < for debugging only
					// console.log(`[VC] START-OF-SPEECH TIMEOUT ${startTimeForTimerStartSpeechRef.current} >> No user speech for ${elapsedTime} ms (timout was set to ${timeoutDuration} ms) -- speechStartTimeoutCounterRef.current: ${speechStartTimeoutCounterRef.current}`)

					if (conversationInfo?.activePage == 2 || conversationInfo?.activePage == conversationInfo?.totalPages - 1) {
						// Auto-progress:
						// - From Ready message to first question (page 2 -> page 3)
						// - From Sign-off message to goodbye message (page total-1 -> page total)
						resetSpeechStartTimeoutCounter(); // < speech start timeout counter back to 0...
						handleChangePage(conversationInfo?.activePage + 1); // < ...because we're moving to next question
					} else {
						// if (conversationInfo?.activePage > 2) {

						if (speechStartTimeoutCounterRef.current == 1) {
							// Auto-repeat question upon Timeout 1:
							if (conversationInfo?.activePage < conversationInfo?.totalPages - 1) {
								// console.log(`[VC] REPEAT QUESTION - page ${conversationInfo?.activePage} of ${conversationInfo?.totalPages}`);					// < repeat current question (if it's not intro or ready message)
								reloadCurrentPage(conversationInfo?.activePage); // < repeat current question (if it's not intro or ready message)
							} else if (conversationInfo?.activePage == conversationInfo?.totalPages - 1) {
								// Sign-off message - don't repeat this - if not user input, just move on to sign-off message:
								resetSpeechStartTimeoutCounter(); // < speech start timeout counter back to 0...
								handleChangePage(conversationInfo?.activePage + 1); // < ...because we're moving to next question
							} else {
								// console.log(`[VC] END INTERVIEW - page ${conversationInfo?.activePage} of ${conversationInfo?.totalPages}`);
								// after the last message, auto-end the interview if the user has not done so already:
								handleMeetingEnd();
							}
						} else {
							// Auto-progress to next question on Timeout 2:
							// console.log(`[VC] NEXT QUESTION`);					// < repeat current question (if it's not intro or ready message)
							resetSpeechStartTimeoutCounter(); // < speech start timeout counter back to 0...
							handleChangePage(conversationInfo?.activePage + 1); // < ...because we're moving to next question
						}
					}
				}, timeoutDuration); // in milliseconds
				// console.log(`[VC] START-OF-SPEECH TIMER STARTED: ${timerStartSpeechRef.current}`);
			}
		}
	}, [isAvatarSpeaking]);

	// ========================================================================
	// GUI Layout:

	const openPreviewVideoModal = () => {
		setOpenModal({
			modalType: MODAL_TYPES.VIDEO_AUDIO_CONTROLS,
			data: {
				handleMeetingJoin: startMeeting,
			},
		});
	};

	return (
		<MessagingLayout conversationInfo={conversationInfo}>
			{meetingExpired && <ExpiredMeeting />}

			{!meetingExpired && meetingEnded && <EndScreen />}

			{!meetingExpired && !meetingEnded && (
				<>
					<AIAvatar selectedAssistant={selectedAssistant} width={'100%'} height={'100%'} borderRadius='0px' showBorder={false} enableZoom={false} color={'#fff'} type={'video'} avatar={avatar} canPlay flexGrow='1' setSpeaking={setIsAvatarSpeaking} />
					{conversationInfo?.activePage > 1 ? (
						<StyledVideoGridWrapper>
							{videoLoading ? (
								<>
									<CircularProgress sx={{ color: 'white' }} />
								</>
							) : (
								<VideoTileGrid />
							)}
						</StyledVideoGridWrapper>
					) : null}
					<Toolbar
						conversationInfo={conversationInfo}
						interviewStartedDisabled={!!meetingId || loading}
						onMeetingStartStopClick={meetingStatus !== MeetingStatus.Succeeded ? handleMeetingJoin : handleMeetingEnd}
						interviewStarted={meetingStatus === MeetingStatus.Succeeded}
						loading={loading || meetingStatus === MeetingStatus.Succeeded}
						loadingEndInterview={loadingEndInterview}
						handleChangePage={handleChangePage}
					/>
				</>
			)}
			<AlertDialog
				isOpen={interviewCompleted}
				onClose={() => {
					setInterviewCompleted(false);
				}}
				title=''
				content='You have already completed this interview. Thank you for your time.'
				btnLabel='OK'
			/>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={initializing || loading}>
				<CircularProgress color='inherit' />
			</Backdrop>
			{renderModal}
		</MessagingLayout>
	);
}
