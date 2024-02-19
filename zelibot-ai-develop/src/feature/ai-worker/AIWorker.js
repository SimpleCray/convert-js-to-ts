import { Helmet } from 'react-helmet-async';
import { API_GET_PARTICULAR_CONVERSATION, APP_NAME } from '../../config-global';
import AIWorkerLayout from './layout';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../auth/context/useAuthContext';
import { AISpeechToText, AIGetAPIRequest, AIPostAPIRequest, getSelectedAssistantId, getChatAnimation, getSoftwareNewVersion } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { OutputCards, WebsocketError, ActionModal } from './components';
import { AIWebsocketUrl, AIWebsocketPayload } from './constants/AIWebsocket';
import { useSnackbar } from 'notistack';
import { createHtmlFromText } from './helpers/createHtmlFromText';
import EducationalModal from './components/educational-modal/EducationalModal';
import useEducationModal from './hooks/useEducationModal';
import { StyledBackgroundStyles } from './layout';
import { AIAvatarVideoFile_v2 } from './components';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/modal';
import { componentLoader, FEATURES_WITHOUT_WEBSOCKET } from './helpers/componentLoader';
import { PROMPT_LIST } from '../../config-global';
import { clearRefreshComponent } from '../../redux/slices/refresh';
import { clearAiWorkerData } from '../../redux/slices/aiworkerSlice';
import { SplashScreen } from '../../components/loading-screen';
import { APP_VERSION, CONTEXT_BASE_API, API_PAYMENT_STATUS } from '../../config-global';
import { removeURLParameter, getUrlParameter } from '../../helpers/url';
import { title } from 'process';
import { type } from 'os';

const AIWorkerContext = createContext();

export function useAIWorkerContext() {
	const context = useContext(AIWorkerContext);
	// if (!context) {
	// 	throw new Error('useAIWorkerContext context must be used inside AIWorkerContextProvider');
	// }
	return context;
}

const AIWorkerContextProvider = ({ children, value }) => {
	const { handleRemoveCartById, rawLeftPrompts, outputCardAction, sourceLinks, clickRequestAction, clearVideoExecutionQueue } = value;
	const [triggerUpdate, setTriggerUpdate] = useState(false);
	const toggleTriggerUpdate = () => {
		setTriggerUpdate((prevState) => !prevState);
	};
	return <AIWorkerContext.Provider value={{ outputCardAction, handleRemoveCartById, triggerUpdate, toggleTriggerUpdate, rawLeftPrompts, sourceLinks, clickRequestAction, clearVideoExecutionQueue }}>{children}</AIWorkerContext.Provider>;
};

// Helper method to add messages to the dialogue between user and AI helper.
// This to ensure that message balloons are correctly shaped based on their
// position in the message sequence. (Erik, 17/10/2023)
function addMessageToDialogue(prevDialogue, id, type, body) {
	let newShape = 'single';

	if (prevDialogue.length > 0) {
		const lastMessage = prevDialogue[prevDialogue.length - 1];

		if (lastMessage.type !== type) {
			// Single: User msg following AI msg, or vice versa:
			newShape = 'single';
		} else {
			// Series: User msg following previous user msg, or AI msg following previous AI msg:
			newShape = 'last'; // new msg is last one in series
			if (lastMessage.shape === 'single') {
				lastMessage.shape = 'first'; // prev msg is first one in series
			} else if (lastMessage.shape === 'last') {
				lastMessage.shape = 'mid'; // prev msg is successive one in series
			}
		}
	}

	const newMessage = {
		id: id,
		type: type,
		body: body,
		shape: newShape,
	};

	return [...prevDialogue, newMessage];
}

const ACTION_TO_TARGET_COMPONENT = {
	SEND_INVITATION_EMAIL: 'WSC_CANDIDATE_APPLICATION_EMAIL_INVITATION',
};

const COLLAPSE_ACTION = 'COLLAPSE_OUTPUT_CARD';

export default function AIWorker() {
	const { enqueueSnackbar } = useSnackbar();
	const { user, refreshUserSession } = useAuthContext();
	const speechToTextRef = useRef();
	const defaultAvatar = {
		id: uuidv4(),
		url: 'silence_60s.mp4',
		loop: true,
	};
	const { shouldShowEducationModal, hideEducationalModalForNow, hideEducationalModalForever, showEducationModal, educationModalHidden, setEducationModalHidden } = useEducationModal();
	const [messageValue, setMessageValue] = useState('');
	const [speaking, setSpeaking] = useState(false);
	const [dialogue, setDialogue] = useState([]);
	const [isListening, setIsListening] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false); // in between mic state
	const [outputCards, setOutputCards] = useState([]);
	const [prompts, setPrompts] = useState([]);
	const [leftPrompts, setLeftPrompts] = useState([]);
	const [rawLeftPrompts, setRawLeftPrompts] = useState([]);
	const [avatar, setAvatar] = useState(defaultAvatar);
	const selectedAssistantRef = useRef({ id: '01', name: 'Zeli', role: 'HR Specialist' });
	// ZK-172 Upon deleting WSC from Output Panel, should NOT scroll to bottom
	const preventToScrollToBottomRef = useRef(false);
	const [writingContent, setWritingContent] = useState(false);
	const [avatarChatResponse, setAvatarChatResponse] = useState('');
	const [sourceLinks, setSourceLinks] = useState([]);
	const [action, setAction] = useState(null);
	const [socket, setSocket] = useState(null);
	const [socketPayload, setSocketPayload] = useState(null);
	const convo_guid_from_session = JSON.parse(window.sessionStorage.getItem('currentConversationGuid'));
	const [conversationGuid, setConversationGuid] = useState(convo_guid_from_session ? convo_guid_from_session : null);
	const [currentOutputCardId, setCurrentOutputCardId] = useState(null);
	const [responseHasTargetUrl, setResponseHasTargetUrl] = useState(false);
	const [promptListUrl, setPromptListUrl] = useState(null);
	const [webSocketStatus, setWebSocketStatus] = useState('connecting');
	const [isPromptsOpen, setIsPromptsOpen] = useState(false);
	const [openActionModal, setOpenActionModal] = useState(false);
	const [actionModalData, setActionModalData] = useState({});
	const [videoExecutionQueue, setVideoExecutionQueue] = useState([]);
	const [AIWorkerSplash, setAIWorkerSplash] = useState(true);
	const SOFTWARE_UPDATE_TIMER = 60; // minutes
	const [apiVersionTimer, setApiVersionTimer] = useState(SOFTWARE_UPDATE_TIMER * 10000);
	const [workspaceScrollPosition, setWorkspaceScrollPosition] = useState(0);
	const [userHasScrolled, setUserHasScrolled] = useState(false);
	const [stateShouldUpdate, setStateShouldUpdate] = useState(true);
	const [zeliThinking, setZeliThinking] = useState(false);
	const [requestId, setRequestId] = useState('');

	const FIRST_TIME_ATS = 'FIRST_TIME_ATS';

	// temp. maybe. hacky way to stop things before this is hidden
	// const [educationModalHidden, setEducationModalHidden] = useState(false);

	// Websocket section -- pulled from mvp code
	const [lastChatResponse, setLastChatResponse] = useState('');
	const [userChatResponse, setUserChatResponse] = useState([]);
	const [chatResponseList, setChatResponseList] = useState([]);
	const conversationGuidRequested = useSelector((state) => state.aiworker.data?.conversation_guid);
	const modalData = useSelector((state) => state.modal);
	const refreshData = useSelector((state) => state.refresh);
	const dispatch = useDispatch();

	useEffect(() => {
		let interval;
		// Refreshing the token every 30 minutes.
		let duration = 30 * 60 * 1000
		interval = setInterval(() => {
			refreshUserSession();
		}, duration)

		return () => {
			clearInterval(interval);
		}
	}, [])

	useEffect(() => {
		// This is to pop up most recent conversation based on user session
		// console.log('Conversation GUID on Component MOUNT >>> ', conversationGuid);
		if (conversationGuid) {
			requestPreviousConversation(conversationGuid);
		} else {
			setAIWorkerSplash(false);
		}
	}, []);

	useEffect(() => {
		if (conversationGuid) {
			// console.log('Conversation Guid exists >>> ', conversationGuid);
			window.sessionStorage.setItem('currentConversationGuid', JSON.stringify(conversationGuid));
		} else {
			// console.log('Conversation Guid does not exist ', conversationGuid);
			window.sessionStorage.removeItem('currentConversationGuid');
		}
	}, [conversationGuid]);

	useEffect(() => {
		if (modalData?.visible) {
			setOpenActionModal(true);
			setActionModalData({ action: modalData.modalComponent });
		} else {
			setOpenActionModal(false);
			setActionModalData({});
		}
	}, [modalData.visible]);

	useEffect(() => {
		if (refreshData?.component === 'NEW_CONVERSATION') {
			handleNewConversation();
			dispatch(clearRefreshComponent());
		}
	}, [refreshData.component]);

	useEffect(() => {
		// This is the request being made from conversation history popup
		if (conversationGuidRequested) {
			requestPreviousConversation(conversationGuidRequested);
		}
	}, [conversationGuidRequested]);

	// Handle actions from the input trigger
	const handleSendMessageAction = useCallback(({ e, messageInputValue, messageProp }) => {
		const messageToSend = messageProp ?? messageInputValue ?? messageValue;
		if (messageToSend.trim().length < 1) return;
		e?.preventDefault();
		const id = uuidv4();
		// send to socket
		setAction({ name: 'input', action: 'DEFAULT' });
		// Add the user message to the dialogue
		setDialogue((prevState) => addMessageToDialogue(prevState, id, 'USER', messageToSend));
		setZeliThinking(true);
		// console.log('Conversation GUID in send message is ', conversationGuid)
		setSocketPayload(AIWebsocketPayload('DEFAULT', messageToSend, user, conversationGuid, selectedAssistantRef?.current?.id || '01'));
		setMessageValue('');
	}, [conversationGuid, messageValue]);

	const handlePromptAction = useCallback(async (action, title) => {
		const id = uuidv4();
		// Add the user message to the dialogue
		setDialogue((prevState) => addMessageToDialogue(prevState, id, 'USER', title));
		// Send action to websocket
		setAction({ name: 'prompt', action });

		if (FEATURES_WITHOUT_WEBSOCKET.some((el) => el === action[0])) {
			const cardObj = componentLoader(action[0]);
			setAction({ name: action, action: action[0] });

			setOutputCards((prevState) => [...prevState, cardObj]);

			const animationRes = await handleGetChatAnimation(action[0] === 'REVIEW_CANDIDATES' ? 'DISPLAY_CANDIDATE_LISTING' : action[0], conversationGuid, title);
			cardObj['avatar_dialog'] = animationRes?.avatar_dialog ? animationRes?.avatar_dialog : '';
			cardObj['video_url'] = animationRes?.video_url[0];

			await handleWebsocketEvent(cardObj);
			return;
		}
		setZeliThinking(true);
		setSocketPayload(AIWebsocketPayload(action, messageValue, user, conversationGuid, selectedAssistantRef?.current?.id || '01', null, null, title));
	}, []);

	const loadComponentBasedOnAction = async (action, title) => {
		const id = uuidv4();

		if (componentLoader(action)) {
			setAction({ name: action, action });
			let cardObj = componentLoader(action);
			setOutputCards((prevState) => [...prevState, cardObj]);
			setCurrentOutputCardId(id);
			const animationRes = await handleGetChatAnimation(action === 'REVIEW_CANDIDATES' ? 'DISPLAY_CANDIDATE_LISTING' : action, conversationGuid, title);
			cardObj['avatar_dialog'] = animationRes['avatar_dialog'];
			cardObj['video_url'] = animationRes?.video_url[0];
			cardObj['conversation_id'] = conversationGuid;

			handleWebsocketEvent(cardObj);
		} else {
			// Send action to websocket
			setAction({ name: 'prompt', action });
			setSocketPayload(AIWebsocketPayload(action, messageValue, user, conversationGuid, selectedAssistantRef?.current?.id || '01'));
		}
	};

	const handleGetChatAnimation = async (action, conversationGuid, action_text) => {
		try {
			const response = await getChatAnimation(action, conversationGuid, action_text);
			if (response) {
				return response;
			}
		} catch (err) {
			console.error(err);
			enqueueSnackbar('Error in the chat', { variant: 'error' });
		}
	};

	// For side menu nav items. Probably temp and identical to prompt actions
	// Just cloned to have a more distinctive and sensible name
	const handleSideMenuAction = useCallback((action, title) => {
		const id = uuidv4();

		// console.log('Action and Title of PromptAction > ', action, title);
		if (action === 'CONVERSATION_SUMMARY') {
			setOpenActionModal(true);
			setActionModalData({ id, action, title });
			return;
		}

		// Add the user message to the dialogue
		setDialogue((prevState) => addMessageToDialogue(prevState, id, 'USER', title));
		if (action === FIRST_TIME_ATS) {
			// Rather than send a request to load a whole new stack of ATS cards and clog it all up
			// Just shuffle the existing cards to move them to the bottom
			const atsCard = outputCards.filter((card) => card.type === FIRST_TIME_ATS);
			if (atsCard.length) {
				const otherCards = outputCards.filter((card) => card.type !== FIRST_TIME_ATS);
				const cardsToSet = otherCards.concat(atsCard);
				setOutputCards(cardsToSet);
			} else {
				// If (somehow) the ATS cards aren't already in place, send as normal
				setAction({ name: 'prompt', action });
				setSocketPayload(AIWebsocketPayload(action, messageValue, user, conversationGuid, selectedAssistantRef?.current?.id || '01'));
			}
		} else {
			loadComponentBasedOnAction(action, title);
		}
	}, []);

	const handleRemoveCartById = (removeCardId) => {
		setOutputCards((prevList) => prevList.filter((item) => item.id !== removeCardId));
	};

	const handleNotificationAction = useCallback((data) => {
		setAction({ name: 'notification', data });
		setSocketPayload(AIWebsocketPayload('VIEW_DOCUMENT', { url: data.signedUrl?.split('?')[0] }, user, conversationGuid, selectedAssistantRef?.current?.id || '01'));
	}, []);

	const handleOutputCardAction = useCallback((id, action, body) => {
		// Handle action modal
		if (action === 'COMPOSE_EMAIL' || action === 'COMPOSE_TEXT' || action === 'COMPOSE_SMS' || action === 'FEATURE_UNSUPPORTED' || action === 'SETTINGS' || action === 'CONVERSATION_SUMMARY') {
			setOpenActionModal(true);
			// console.log('Setting modal to ', action)
			setActionModalData({ id, action, body });
			return;
		}

		// Send action to websocket
		const dataTransformer = {
			CONVERT_TO_PDF: (data) => ({ text: data, html: createHtmlFromText(data) }),
		}[action];
		// console.log('Body value is >>> ', action, body)
		body = body ?? messageValue;
		body = dataTransformer ? dataTransformer(body) : body;

		setAction({ name: 'output', action });
		setSocketPayload(AIWebsocketPayload(action, body, user, conversationGuid, selectedAssistantRef?.current?.id || '01', id));
	}, []);

	const handleOutputCardWithClickRequestAction = useCallback(async (id, action, clickRequest, target_url) => {
		// Send action to websocket
		if (!clickRequest) {
			return;
		}

		if (clickRequest.title) {
			setDialogue((prevState) => addMessageToDialogue(prevState, id, 'USER', clickRequest.title));
		}

		if (action === COLLAPSE_ACTION) {
			setOutputCards((prevState) => prevState.filter(({ id: outputCardId }) => id !== outputCardId));
			return;
		}

		if (Object.keys(ACTION_TO_TARGET_COMPONENT).includes(action)) {
			// const id = uuidv4();
			setOutputCards((prevState) => [
				...prevState,
				{
					id: id,
					data: clickRequest,
					type: ACTION_TO_TARGET_COMPONENT[action],
				},
			]);
			setCurrentOutputCardId(id);
			return;
		}

		if (FEATURES_WITHOUT_WEBSOCKET.some((el) => el === action)) {
			setAction({ name: action, action });
			const cardObj = componentLoader(action, clickRequest, target_url);
			setOutputCards((prevState) => [...prevState, cardObj]);
			if (action === 'CLIENT_DETAILS') {
				return;
			}
			const animationRes = await handleGetChatAnimation(action === 'REVIEW_CANDIDATES' ? 'DISPLAY_CANDIDATE_LISTING' : action, conversationGuid, '');
			cardObj['avatar_dialog'] = animationRes['avatar_dialog'];
			cardObj['video_url'] = animationRes?.video_url[0];
			cardObj['conversation_id'] = conversationGuid;

			await handleWebsocketEvent(cardObj);
			return;
		}

		setAction({ name: 'output', action });
		setZeliThinking(true);
		setSocketPayload(AIWebsocketPayload(action, messageValue, user, conversationGuid, selectedAssistantRef?.current?.id || '01', id, clickRequest));
	}, []);

	const handleActionModalClose = () => {
		dispatch(closeModal());
		setOpenActionModal(false);
	};

	const handleNewConversation = useCallback(async () => {
		let newId = uuidv4()
		setConversationGuid(newId);
		window.sessionStorage.removeItem('currentConversationGuid');
		// console.log('Output cards data is >>> ', outputCards);
		setOutputCards([]);
		setDialogue([]);
		setPromptListUrl(null);
		setIsPromptsOpen(false);
		setPrompts([]);
		setVideoExecutionQueue([]);
		// setConversationGuid(null);
		dispatch(clearAiWorkerData());

		setSocketPayload(AIWebsocketPayload(FIRST_TIME_ATS, '', user, newId, selectedAssistantRef?.current?.id || '01', '', null, '', true));
	}, []);

	const requestPreviousConversation = async (conversation_guid) => {
		setAIWorkerSplash(true);
		let data = await AIGetAPIRequest(API_GET_PARTICULAR_CONVERSATION + `?conversation_guid=${conversation_guid}`);
		// console.log('Conversation Response is ', data)
		if (data?.message === 'SUCCESS') {
			let messagesArray = data?.conversations[0]?.conversations.filter((message) => message?.sender === 'USER' || message?.sender === 'AVATAR');
			// Formation of Assistant Array
			let assistantArray = data?.conversations[0]?.conversations.filter((message) => message?.sender === 'ASSISTANT' && !message?.avatar_data);
			// The below code is to make sure assistant messages are not following a message that has an avatar_data key.
			// let assistantArray = [];
			// data?.conversations.forEach((conversation) => {
			// 	conversation?.conversations?.forEach((message, index) => {
			// 		if (message.sender === "ASSISTANT") {
			// 			// Check if the previous component does not have avatar_data key
			// 			if (index === 0 || conversation?.conversations[index - 1]?.avatar_data?.target_component === 'DEFAULT') {
			// 				assistantArray.push(message);
			// 			}
			// 		}
			// 	});
			// });
			let firstTimeATSOutputCard = {
				type: 'FIRST_TIME_ATS',
			};
			let outputCards = [firstTimeATSOutputCard];
			if (messagesArray?.length > 0) {
				let messages = messagesArray.map((message) => {
					return {
						id: uuidv4(),
						type: message?.sender === 'USER' ? 'USER' : message?.sender === 'AVATAR' ? 'ASSISTANT' : null,
						body: message?.message,
						shape: 'single',
					};
				});
				// console.log('Setting the dialogues to the requested conversation ', messages);
				setDialogue(messages);
				setConversationGuid(conversation_guid);
			}
			if (assistantArray?.length > 0) {
				// console.log('Assistant Array is >>> ', assistantArray)
				// Set output cards to empty and LLM content here
				let llmOutputCards = assistantArray.map((llm) => {
					return {
						// id: uuidv4(),
						type: 'DEFAULT',
						assistantMessage: llm?.message,
					};
				});
				// console.log('Llm output cards are ', llmOutputCards);
				setOutputCards((prevState) => (prevState.find((item) => item.type === 'FIRST_TIME_ATS') ? [firstTimeATSOutputCard, ...llmOutputCards] : [...llmOutputCards]));
			} else {
				setOutputCards((prevState) => (prevState.find((item) => item.type === 'FIRST_TIME_ATS') ? [firstTimeATSOutputCard] : []));
			}
		} else {
			setDialogue([]);
		}
		setPromptListUrl(null);
		setIsPromptsOpen(false);
		setPrompts([]);
		setVideoExecutionQueue([]);
		setAIWorkerSplash(false);
	};

	const loadAtsWithoutWebSocket = async (action) => {
		const cardObj = componentLoader(action);
		setAction({ name: action, action: action });

		setOutputCards((prevState) => [...prevState, cardObj]);
		const animationRes = await handleGetChatAnimation(action, conversationGuid, '');
		cardObj['avatar_dialog'] = animationRes['avatar_dialog'];
		cardObj['video_url'] = animationRes?.video_url[0];
		handleWebsocketEvent(cardObj);
	};

	const handleTranscriptChange = async (transcript) => {
		const sampletext = ['Sally', 'jelly', 'Siri', 'Sali', 'Salli', 'Sheli', 'Zoe', 'Zelig', 'Silly', 'Zelly'];

		await sampletext.map(async (string) => {
			transcript = transcript.replace(new RegExp(string, 'g'), 'Zeli');
		});
		setMessageValue(transcript);
		return transcript;
	};

	const handleListeningStatusChange = (isListening) => {
		// console.log('[VUI] Listening status has changed to ', isListening);
		setIsListening(isListening);
	};

	const handleProcessingStatusChange = (isProcessing) => {
		// console.log('[VUI] Processing status has changed to ', isProcessing);
		setIsProcessing(isProcessing);
	};

	const toggleSpeechToText = () => {
		if (!isListening) {
			setIsProcessing(true);
			// console.log('[VUI] User clicked Rec Start: going to start listening');
			speechToTextRef.current?.startListening();
		} else {
			setIsProcessing(true);
			// console.log('[VUI] User clicked Rec Stop: going to stop listening');
			speechToTextRef.current?.stopListening();
			setIsListening(false);
		}
	};

	const handleMicAction = useCallback(async () => {
		await toggleSpeechToText();
	}, []);

	const handleUploadAction = useCallback(async () => {
		// console.log('Handle Upload Action Console Log');
		const messageToSend = 'Upload documents';
		if (messageToSend.trim().length < 1) return;
		const id = uuidv4();
		// send to socket
		setAction({ name: 'input', action: 'DEFAULT' });
		setDialogue((prevState) => addMessageToDialogue(prevState, id, 'USER', messageToSend));
		// setSocketPayload(AIWebsocketPayload('DEFAULT', messageToSend, user, conversationGuid, selectedAssistant?.id || '01'));
		const cardObj = componentLoader('UPLOAD_RESUMES', '');
		setOutputCards((prevState) => [...prevState, cardObj]);

		const animationRes = await handleGetChatAnimation('UPLOAD_RESUMES', conversationGuid, '');
		cardObj['avatar_dialog'] = animationRes?.avatar_dialog;
		cardObj['video_url'] = animationRes?.video_url[0];

		await handleWebsocketEvent(cardObj);
		setMessageValue('');
	}, []);

	// Set up the websocket connection
	const setupWebSocket = () => {
		let id = uuidv4();
		if (!socket) {
			const ws = new WebSocket(AIWebsocketUrl(id));
			ws.onopen = () => {
				setSocket(ws);
				setWebSocketStatus('connected');
				if (socketPayload) {
					ws.send(JSON.stringify(socketPayload));
				}
			};
			ws.onclose = () => {
				setSocket(null);
				setWebSocketStatus('disconnected');
			};
			ws.onerror = (error) => {
				console.error('WebSocket error:', error);
				ws.close();
				setSocket(null);
				setWebSocketStatus('error');
			};
			ws.onmessage = (event) => {
				const parsedSocketMessage = JSON.parse(event.data);
				handleWebsocketEvent(parsedSocketMessage);
			};
		}
	};

	const EDITOR_CARDS = ['JOB_REQUISITION'];

	const handleWebsocketEvent = useCallback((parsedSocketMessage) => {
		const id = uuidv4();
		// console.log('The conversation Guid in websocket response is ', conversationGuid)
		if (!conversationGuid) {
			// console.log('Setting a new conversation guid')
			if (parsedSocketMessage?.data?.conversation_guid) {
				// console.log('Setting a new conversation guid 1', parsedSocketMessage?.data?.conversation_guid)
				setConversationGuid(parsedSocketMessage?.data?.conversation_guid);
			} else if (parsedSocketMessage?.conversation_guid) {
				// console.log('Setting a new conversation guid 2', parsedSocketMessage?.conversation_guid)
				setConversationGuid(parsedSocketMessage?.conversation_guid);
			}
		}
		switch (parsedSocketMessage.action) {
			case 1:
				if (!responseHasTargetUrl) {
					setWritingContent(true);
					setAvatarChatResponse((prev) => prev + parsedSocketMessage.data);
				}
				break;
			case 2:
				if (parsedSocketMessage.data === '#EOM') {
					if (parsedSocketMessage.conversation_guid) {
						setWritingContent(false);
						setResponseHasTargetUrl(false);
						setPromptListUrl(null);
						setRequestId(parsedSocketMessage.request_id);
					}
				}
				break;
			case 3: // Load component
				if (parsedSocketMessage?.target_component) {
					if (parsedSocketMessage?.target_component === FIRST_TIME_ATS) {
						setOutputCards((prevState) => {
							if (!prevState.find((item) => item.type === parsedSocketMessage?.target_component)) {
								// console.log('Setting output cards to have First Time ATS card', prevState);
								return [
									{
										id: parsedSocketMessage?.event_id ? parsedSocketMessage?.event_id : uuidv4(),
										data: parsedSocketMessage?.data,
										type: parsedSocketMessage?.target_component,
										title: parsedSocketMessage?.title,
										action: parsedSocketMessage?.action,
										target_url: parsedSocketMessage?.target_url,
										compound_component: parsedSocketMessage?.compound_component,
										target_api_endpoint: parsedSocketMessage?.target_api_endpoint,
										target_path: parsedSocketMessage?.target_path,
										event_id: parsedSocketMessage?.event_id,
									},
									...prevState,
								];
							} else {
								// console.log('Includes FIRST_TIME_ATS already so do not append card', prevState)
								return [...prevState];
							}
						});
					} else {
						// console.log('It is not FIRST TIME ATS CARD ', outputCards)
						setOutputCards((prevState) => [
							...prevState,
							{
								id: parsedSocketMessage?.event_id ? parsedSocketMessage?.event_id : uuidv4(),
								data: parsedSocketMessage?.data,
								type: parsedSocketMessage?.target_component,
								title: parsedSocketMessage?.title,
								action: parsedSocketMessage?.action,
								target_url: parsedSocketMessage?.target_url,
								compound_component: parsedSocketMessage?.compound_component,
								target_api_endpoint: parsedSocketMessage?.target_api_endpoint,
								target_path: parsedSocketMessage?.target_path,
								event_id: parsedSocketMessage?.event_id,
							},
						]);
					}
					setCurrentOutputCardId(parsedSocketMessage?.event_id);
				}
				setAvatarChatResponse('');
				setSourceLinks([]);
				// If response has target url, set it to true
				parsedSocketMessage?.target_url && setResponseHasTargetUrl(true);
				if (!FEATURES_WITHOUT_WEBSOCKET.includes(parsedSocketMessage?.type)) {
					parsedSocketMessage?.avatar_dialog && setDialogue((prevState) => addMessageToDialogue(prevState, id, 'ASSISTANT', parsedSocketMessage?.avatar_dialog));
					setZeliThinking(false);
				}
				// Manage a queue of protocols over here if the protocol has a video or dialogue. If it does, set the avatar chat response.
				// Add a paramter in the AI Video component that checks if the video has ended, and if it has, check the queue and play the next video.
				// If there is no video in the queue, set the avatar to silence.
				if (parsedSocketMessage.video_url && parsedSocketMessage.avatar_dialog) {
					// Only append the video to the queue under the following circumstances -->
					// 1) The expected response is from the backend & is not front end generated i.e immediate
					// 2)
					// console.log('Parsed socket message before video queue > ', parsedSocketMessage);
					if (!FEATURES_WITHOUT_WEBSOCKET.includes(parsedSocketMessage?.type)) {
						setVideoExecutionQueue((prevState) => [...prevState, { id: id, url: parsedSocketMessage.video_url, loop: false }]);
					}
				}
				// parsedSocketMessage?.video_url && setAvatar({ id: id, url: parsedSocketMessage?.video_url, loop: false });
				setPromptListUrl(parsedSocketMessage?.prompt_list_url); // ! Removed promptListUrl
				break;
			case 4:
				if (parsedSocketMessage?.data) {
					setSourceLinks(parsedSocketMessage?.data ?? []);
				}
				break;
			case 5:
				setOpenActionModal(true);
				setActionModalData({ id: '2', action: 'SHOW_SUBSCRIPTION', body: { type: parsedSocketMessage.target_component } });
				break;

			default:
				break;
		}
		return;
	}, [conversationGuid])

	useEffect(() => {
		if (videoExecutionQueue.length > 0) {
			setAvatar(videoExecutionQueue[0]);
			// setVideoExecutionQueue((prevState) => prevState.slice(1));
		} else {
			setAvatar(defaultAvatar);
		}
	}, [videoExecutionQueue]);

	const filterVideoExecutionQueue = useCallback((id) => {
		setVideoExecutionQueue((prevState) => prevState.filter((item) => item.id !== id));
	}, []);

	const clearVideoExecutionQueue = () => {
		if (videoExecutionQueue?.length > 0) {
			setVideoExecutionQueue([]);
			setAvatar(defaultAvatar);
		}
	};

	// Handle setting the selected assistant
	useEffect(() => {
		if (stateShouldUpdate) {
			getSelectedAssistantId().then((response) => {
				selectedAssistantRef.current = {
					id: '0' + response?.data[0]?.assistant_id ?? 1,
					name: 'Zeli',
					role: 'HR Helper',
				};
				setStateShouldUpdate(false);
				setAvatar({ id: uuidv4(), url: AIAvatarVideoFile_v2('silence_60s.mp4', response?.data[0]?.assistant_id), loop: true });
			});
		}
	}, [stateShouldUpdate]);

	// Send messages to the websocket
	useEffect(() => {
		if (!socket || socket?.readyState === WebSocket.CLOSED) {
			setupWebSocket();
		} else {
			if (socketPayload) {
				socket.send(JSON.stringify(socketPayload));
			}
		}
	}, [socketPayload]);

	// useEffect(() => {
	// 	if (socketPayload && socket !== undefined && socket !== null) {
	// 		socket?.send(JSON.stringify(socketPayload));
	// 	}
	// }, [socket, socketPayload])

	const processPrompts = (prompts) => {
		const map = [];
		for (const p of prompts) {
			if (!map[p.prompt_group_id - 1]) {
				map[p.prompt_group_id - 1] = {
					title: p.prompt_group_title,
					prompts: [],
				};
			}

			map[p.prompt_group_id - 1].prompts.push(p);
		}
		const filtered = map.filter((m) => m);
		return filtered;
	};

	const handleCardClose = async (event) => {
		const filteredArr = outputCards.filter((el) => {
			return el.id !== event.id;
		});
		setOutputCards(filteredArr);
		preventToScrollToBottomRef.current = true;

		try {
			await AIPostAPIRequest(`${CONTEXT_BASE_API}/remove_chat_context`, {
				event_id: event.id,
				conversation_id: conversationGuid,
			});
		} catch (err) {
			console.error(error);
		}
	};

	// Handle prompts from the websocket
	useEffect(() => {
		let promptUrl = FEATURES_WITHOUT_WEBSOCKET.some((el) => el === action?.action) ? `${PROMPT_LIST}?action_id=${action?.action}` : promptListUrl;
		if (promptUrl) {
			const handleGetPrompts = async () => {
				await AIGetAPIRequest(promptUrl)
					.then((response) => {
						if (response?.prompts?.length > 0) {
							let sequenceSortedPrompts;
							if (response?.prompts[0].prompt_position === 'DRAWER') {
								sequenceSortedPrompts = response?.prompts.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));
							} else {
								sequenceSortedPrompts = response?.prompts;
							}
							const ungroupedWorkspacePrompts = sequenceSortedPrompts.filter((p) => p.prompt_position === 'WORK_SPACE');
							const workspacePrompts = processPrompts(ungroupedWorkspacePrompts);
							const drawerPrompts = sequenceSortedPrompts.filter((p) => p.prompt_position !== 'WORK_SPACE');
							if (ungroupedWorkspacePrompts?.length) {
								setRawLeftPrompts(ungroupedWorkspacePrompts);
							}

							if (workspacePrompts.length) {
								setLeftPrompts(() => [
									// Recruitment nav item will trigger a new ATS card so we probably shouldn't keep previous state anymore
									// ...prevState,
									...workspacePrompts,
								]);
								setIsPromptsOpen(false);
							} else {
								// Process these as normal (for right pane)
								setPrompts(drawerPrompts);
								setIsPromptsOpen(true);
							}
						} else {
							setPrompts([]);
							setIsPromptsOpen(false);
						}
					})
					.catch((error) => {
						console.error('error: ', error);
					});
			};
			void handleGetPrompts();
		}

		return;
	}, [promptListUrl]);

	// Handle sending messages to the websocket after the user has stopped speaking
	useEffect(() => {
		if (!isListening && messageValue) {
			handleSendMessageAction({});
		}
	}, [speechToTextRef]);

	// Handle first time login to Zelibot
	useEffect(() => {
		setConversationGuid(uuidv4());

		// setSocketPayload(AIWebsocketPayload('USER_ARRIVED', '', user, '', selectedAssistant?.id || '01'));
		if (educationModalHidden) {
			// ? Below line was used to call web socket and get ATS card
			// loadAtsWithoutWebSocket()
			setSocketPayload(AIWebsocketPayload(FIRST_TIME_ATS, '', user, conversationGuid, selectedAssistantRef?.current?.id || '01', '', null, '', true));
		}
	}, [educationModalHidden, user]);

	useEffect(() => {
		let interval = setInterval(async () => {
			await getSoftwareNewVersion().then((response) => {
				if (response) {
					const newVersion = `version ${response?.version}`;
					if (APP_VERSION !== newVersion) {
						const cardObj = componentLoader('SOFTWARE_UPDATE');
						setOutputCards((prevState) => {
							if (!prevState.find((item) => item.type === 'SOFTWARE_UPDATE')) {
								return [...prevState, cardObj];
							} else {
								return [...prevState];
							}
						});

						cardObj['new_version'] = response.version;
					}
				}
			});
		}, apiVersionTimer);

		checkPaymentStatus();
	}, []);

	const checkPaymentStatus = async () => {

		const checkPay = getUrlParameter('checkPayment');
		const paymentType = getUrlParameter('type');

		if (checkPay) {
			setAIWorkerSplash(true);

			const payID = paymentType === 'payment' ? 'topupPayId' : 'subscribePayId'
			const payId = sessionStorage.getItem(payID);

			try {
				const response = await AIPostAPIRequest(API_PAYMENT_STATUS, { session_id: payId });

				if (response.status === 'SUCCESS') {
					const paymentStatus = response?.payment_session?.payment_status;

					if (paymentStatus === 'paid') {
						const body = { title: 'SUCCESS', content: "Thank you, your payment has been processed.\nI'm here to help you save time and enhance your productivity.", btn: "Let's get started" };
						openPaymentStatusModal(body);
					} else {
						const body = { title: 'FAILURE', content: 'Sorry your payment has not been processed.\nPlease try again.', btn: 'Try again' };
						openPaymentStatusModal(body);
					}
				}

				setAIWorkerSplash(false);
			} catch (err) {
				console.error(err);
				setAIWorkerSplash(false);
			}
		}
	};

	const openPaymentStatusModal = (body) => {
		setOpenActionModal(true);
		setActionModalData({ id: '1', action: 'PAYMENT_STATUS', title: 'Success', body: body });
		removeURLParameter('checkPayment');
		removeURLParameter('type');
	};

	return AIWorkerSplash ? (
		<SplashScreen />
	) : (
		<>
			<StyledBackgroundStyles />
			<Helmet>
				<title> HR Helper | {APP_NAME}</title>
			</Helmet>
			<AIWorkerContextProvider value={{ handleRemoveCartById, rawLeftPrompts, sourceLinks, outputCardAction: handleOutputCardAction, clickRequestAction: handleOutputCardWithClickRequestAction, clearVideoExecutionQueue }}>
				<AIWorkerLayout
					avatar={avatar}
					dialogue={dialogue}
					prompts={prompts}
					messageValue={messageValue}
					setMessageValue={setMessageValue}
					speaking={speaking}
					handleSendMessage={handleSendMessageAction}
					handlePromptAction={handlePromptAction}
					handleUploadAction={handleUploadAction}
					handleMicAction={handleMicAction}
					filterVideoExecutionQueue={filterVideoExecutionQueue}
					videoExecutionQueue={videoExecutionQueue}
					isListening={isListening}
					isProcessing={isProcessing}
					setSpeaking={setSpeaking}
					handleNotificationAction={handleNotificationAction}
					handleNewConversation={handleNewConversation}
					selectedAssistant={selectedAssistantRef?.current}
					writingContent={writingContent}
					isPromptsOpen={isPromptsOpen}
					setIsPromptsOpen={setIsPromptsOpen}
					showEducationModal={showEducationModal}
					outputCardAction={handleOutputCardAction}
					educationModalHidden={educationModalHidden}
					sideMenuAction={handleSideMenuAction}
					workspacePrompts={leftPrompts}
					setWorkspaceScrollPosition={setWorkspaceScrollPosition}
					setUserHasScrolled={setUserHasScrolled}
					userHasScrolled={userHasScrolled}
					zeliThinking={zeliThinking}
					setZeliThinking={setZeliThinking}
					workspaceScrollPosition={workspaceScrollPosition}
					outputCards={outputCards}
				>
					{outputCards && outputCards.length > 0 && educationModalHidden && (
						<OutputCards
							outputCards={outputCards}
							setOutputCards={setOutputCards}
							writingContent={writingContent}
							outputCardAction={handleOutputCardAction}
							clickRequestAction={handleOutputCardWithClickRequestAction}
							promptAction={handlePromptAction}
							avatarChatResponse={avatarChatResponse}
							currentOutputCardId={currentOutputCardId}
							prompts={prompts}
							leftPrompts={leftPrompts}
							setIsPromptsOpen={setIsPromptsOpen}
							userHasScrolled={userHasScrolled}
							workspaceScrollPosition={workspaceScrollPosition}
							handleCardClose={handleCardClose}
							preventToScrollToBottomRef={preventToScrollToBottomRef}
							requestId={requestId}
							conversationGuid={conversationGuid}
						/>
					)}
				</AIWorkerLayout>
			</AIWorkerContextProvider>
			<AISpeechToText ref={speechToTextRef} onTranscriptChange={handleTranscriptChange} onListeningStatusChange={handleListeningStatusChange} onProcessingStatusChange={handleProcessingStatusChange} handleSendMessage={handleSendMessageAction} />
			<WebsocketError open={webSocketStatus === 'error'} />
			<ActionModal actionModalData={actionModalData?.body} type={actionModalData?.action} open={openActionModal} onClose={handleActionModalClose} outputCardAction={handleOutputCardAction} setStateShouldUpdate={setStateShouldUpdate} {...actionModalData} />
			<EducationalModal open={shouldShowEducationModal} closeForNow={hideEducationalModalForNow} closeForEver={hideEducationalModalForever} trackHide={setEducationModalHidden} />
		</>
	);
}
