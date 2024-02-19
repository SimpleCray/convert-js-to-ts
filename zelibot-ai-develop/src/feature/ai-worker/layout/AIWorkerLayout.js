import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
	StyledAIInfoWrapper,
	StyledAIButtonWrapper,
	StyledAIDesktopLayout,
	StyledAIDesktopLayoutContent,
	StyledAIDialogueWrapper,
	StyledAIInteractionPanel,
	StyledAIOutputPanel,
	StyledAIOutputWrapper,
	StyledAIPrompts,
	StyledAIPromptsInner,
	StyledAIPromptsToggle,
	StyledAIPromptsWrapper,
	StyledAIWrapper,
	StyledTextField,
	ResizeDragHangle,
	ResizeDragHangleVerticalLine,
	StyledAIButton,
	StyledAIDesktopLayoutContentWrapper,
} from './AIWorkerLayoutStyles';
import { AIWorkerHeader, AIWorkerNavVertical } from './header';
import { AIAvatar, DialoguePromptCards, PromptCard } from '../components';
import { FilledInput, IconButton, InputAdornment, Typography, useTheme, Stack, Box, TextField, Fab } from '@mui/material';
import MicNoneIcon from '@mui/icons-material/MicNone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import StopIcon from '@mui/icons-material/Stop';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useResponsive from '../../../hooks/useResponsive';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { keyframes } from '@emotion/react';
import DialogueCard from '../components/dialogue-card';
import Draggable from 'react-draggable';

// ----------------------------------------------------------------------
// All rights reserved - Zeligate Pty Ltd - 2023
// ----------------------------------------------------------------------

AIWorkerLayout.propTypes = {
	children: PropTypes.node,
	dialogue: PropTypes.array,
	handleOpen: PropTypes.func,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
	handlePromptAction: PropTypes.func,
	speaking: PropTypes.bool,
	messageValue: PropTypes.string,
	setMessageValue: PropTypes.func,
	handleSendMessage: PropTypes.func,
	handleMicAction: PropTypes.func,
	handleUploadAction: PropTypes.func,
	isListening: PropTypes.bool,
	isProcessing: PropTypes.bool,
	avatar: PropTypes.object,
	setSpeaking: PropTypes.func,
	handleNotificationAction: PropTypes.func,
	selectedAssistant: PropTypes.object,
	writingContent: PropTypes.bool,
	prompts: PropTypes.array,
	outputCardAction: PropTypes.func,
	educationModalHidden: PropTypes.bool,
};

export default function AIWorkerLayout({
	showEducationModal,
	avatar,
	selectedAssistant,
	prompts,
	dialogue,
	handlePromptAction,
	speaking,
	messageValue,
	setMessageValue,
	handleSendMessage,
	handleMicAction,
	handleUploadAction,
	isListening,
	isProcessing,
	setSpeaking,
	children,
	handleNotificationAction,
	writingContent,
	isPromptsOpen,
	setIsPromptsOpen,
	outputCardAction,
	educationModalHidden,
	sideMenuAction,
	workspacePrompts,
	setWorkspaceScrollPosition,
	setUserHasScrolled,
	userHasScrolled,
	filterVideoExecutionQueue,
	videoExecutionQueue,
	zeliThinking,
	setZeliThinking,
	workspaceScrollPosition,
	outputCards,
}) {
	const isDesktop = useResponsive('up', 'md');
	const theme = useTheme();
	const [open, setOpen] = useState(true);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const chatPanelRef = useRef(null);
	const outputPanelRef = useRef(null);
	const chatInputRef = useRef(null);
	const [inputKey, setInputKey] = useState(1);

	const desktopAvatarSize = 160;
	const mobileAvatarSize = 120;
	const avatarSize = isDesktop ? desktopAvatarSize : mobileAvatarSize;
	const chatPanelWidthMinimum = 200;
	const chatPanelWidthDefault = 400;
	const chatPanelWidthMaximum = 1000;
	const [chatPanelWidth, setChatPanelWidth] = useState(chatPanelWidthDefault);
	const [avatarLeft, setAvatarLeft] = useState(calculateAvatarLeft(chatPanelWidthDefault));

	const [isTyping, setIsTyping] = useState(false); // State to manage isTyping flag
	const [micHovered, setMicHovered] = useState(false); // State to manage mic hover state
	const [muted, setMuted] = useState(false);

	function calculateAvatarLeft(chatWidth) {
		return window.innerWidth - chatWidth - avatarSize / 2 - parseInt(theme.spacing(4.5), 10);
	}

	// Default style (for desktop)
	const avatarStyle = {
		zIndex: 1201,
		position: 'absolute',
		left: avatarLeft, // This is the dynamic value you had before
		top: 40,
		cursor: 'grab',
	};

	// If it's not desktop (i.e., it's mobile), modify the style to center the avatar
	if (!isDesktop) {
		avatarStyle.left = '50%'; // Centered in the viewport
		avatarStyle.transform = 'translateX(-50%)'; // Adjust for the avatar's width
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// Add a ref to the dialogue
	const dialogueAnchorRef = useRef(null);

	useEffect(() => {
		// Scroll to bottom on page refresh
		setTimeout(() => dialogueAnchorRef?.current?.scrollTo(0, dialogueAnchorRef?.current?.scrollHeight), 200);
	}, [dialogueAnchorRef?.current?.scrollHeight, zeliThinking, prompts]);

	useEffect(() => {
		// Longer timeout so that the prompt drawer opens then it scrolls
		setTimeout(() => dialogueAnchorRef?.current?.scrollTo(0, dialogueAnchorRef?.current?.scrollHeight), 1000);
	}, [isPromptsOpen]);

	const handleOpenPrompts = () => {
		if (isPromptsOpen) {
			setIsPromptsOpen(false);
		} else {
			setIsPromptsOpen(true);
		}
	};

	const handleResizeMouseDown = (e) => {
		document.addEventListener('mousemove', handleResizeMouseMove);
		document.addEventListener('mouseup', handleResizeMouseUp);

		chatPanelRef.current.style.setProperty('user-select', 'none');
		outputPanelRef.current.style.setProperty('user-select', 'none');
	};

	const handleResizeMouseMove = (e) => {
		let newWidth = window.innerWidth - e.clientX;

		if (newWidth < chatPanelWidthMinimum) {
			newWidth = chatPanelWidthMinimum;
		}
		if (newWidth > chatPanelWidthMaximum) {
			newWidth = chatPanelWidthMaximum;
		}

		setChatPanelWidth(newWidth);
	};

	useEffect(() => {
		// This code runs after the chatPanelWidth state is updated and the component re-renders
		const actualChatPanelWidth = chatPanelRef.current.offsetWidth;
		setAvatarLeft(calculateAvatarLeft(actualChatPanelWidth));
	}, [chatPanelWidth]); // Dependency array: this effect runs when chatPanelWidth changes

	useEffect(() => {
		// If workspaceScrollPosition === clientHeight, that means the user is at the bottom of the page. That's when we should disable the user has scrolled flag.
		if (outputPanelRef?.current) {
			if (Math.abs(outputPanelRef?.current?.scrollHeight - (workspaceScrollPosition + outputPanelRef.current.clientHeight)) <= 5) {
				setUserHasScrolled(false);
			}
		}
	}, [workspaceScrollPosition]);

	const handleResizeMouseUp = () => {
		document.removeEventListener('mousemove', handleResizeMouseMove);
		document.removeEventListener('mouseup', handleResizeMouseUp);

		chatPanelRef.current.style.setProperty('user-select', 'auto');
		outputPanelRef.current.style.setProperty('user-select', 'auto');
	};

	const handleResize = () => {
		const actualChatPanelWidth = chatPanelRef.current.offsetWidth;
		setChatPanelWidth(actualChatPanelWidth);
		setAvatarLeft(calculateAvatarLeft(actualChatPanelWidth));
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [chatPanelWidth, chatPanelWidthMinimum, chatPanelWidthMaximum]);

	// This blur and focus useEffect ensures auto-scroll in input field during speech recognition:
	useEffect(() => {
		if (isListening) {
			chatInputRef?.current?.blur();
			chatInputRef?.current?.focus();
		}
	}, [messageValue]);

	useEffect(() => {
		let timeout;
		if (!isTyping) {
			timeout = setTimeout(() => {
				setInputKey((prevState) => prevState + 1);
			}, 500);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [messageValue]);

	const toggleVolumeUpVisibility = keyframes`
	0% {
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
`;

	const toggleVolumeDownVisibility = keyframes`
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`;

	const toggleWidth = keyframes`
		0% {
			width: 24px;
			height: 24px;
		}
		50% {
			width: 28px;
			height: 28px;
		}
		100% {
			width: 24px;
			height: 24px;
		}
	`;

	const renderChatPanel = () => {
		return (
			<StyledAIInteractionPanel ref={chatPanelRef} style={{ width: `${chatPanelWidth}px` }}>
				{/* AI Helper Info: */}
				<StyledAIInfoWrapper>
					<Stack flex={1} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'space-between'}>
						<Typography variant='h4' color={'#fff'}>
							{selectedAssistant?.name}
						</Typography>
						<Typography variant='body' color={'#fff'}>
							{selectedAssistant?.role}
						</Typography>
					</Stack>
					<Stack pr={1} flex={1} justifyContent={'center'} alignItems={'flex-end'}>
						<Stack onClick={() => setMuted(!muted)} justifyContent={'center'} alignItems={'center'} sx={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#E3C7F9', cursor: 'pointer' }}>
							<Stack
								justifyContent={'center'}
								alignItems={'center'}
								sx={{ width: muted || !speaking ? '28px' : '24px', height: muted || !speaking ? '28px' : '24px', borderRadius: '50%', backgroundColor: '#9859E0', position: 'relative', animation: !muted && speaking ? `${toggleWidth} 1s infinite` : null }}
							>
								{muted ? (
									<VolumeOffIcon sx={{ color: 'white', width: '18px' }} />
								) : speaking ? (
									<>
										<VolumeUpIcon sx={{ color: 'white', width: '18px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: `${toggleVolumeUpVisibility} 0.6s infinite` }} />
										<VolumeDownIcon sx={{ color: 'white', width: '18px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: `${toggleVolumeDownVisibility} 0.6s infinite` }} />
									</>
								) : (
									<VolumeUpIcon sx={{ color: 'white', width: '18px' }} />
								)}
							</Stack>
						</Stack>
					</Stack>
				</StyledAIInfoWrapper>

				{/* Chat Messages: */}
				<StyledAIWrapper>
					<StyledAIDialogueWrapper ref={dialogueAnchorRef}>
						{educationModalHidden && dialogue && dialogue?.map((card, index) => <DialoguePromptCards key={index} id={card?.id} body={card?.body} type={card?.type} shape={card?.shape} zeliThinking={zeliThinking} setZeliThinking={setZeliThinking} />)}
						{zeliThinking ? <DialogueCard type='ThinkingZeli' cardContent={'Zeli Thinking'} shape={'single'} /> : null}
						{/* <div ref={dialogueAnchorRef} /> */}
					</StyledAIDialogueWrapper>
				</StyledAIWrapper>

				{/* Prompt Cards Drawer: */}
				<StyledAIPromptsWrapper hasPrompts={prompts && prompts.length > 0}>
					<StyledAIPromptsToggle onClick={handleOpenPrompts}>{!isPromptsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowUpIcon sx={{ transform: 'rotate(180deg)' }} />}</StyledAIPromptsToggle>
					<StyledAIPromptsInner open={isPromptsOpen}>
						<StyledAIPrompts>
							{prompts && prompts.length > 0 && educationModalHidden && prompts?.map((prompt, index) => <PromptCard key={index} title={prompt?.title} icon={prompt?.icon} action={prompt?.action} setAction={handlePromptAction} setIsPromptsOpen={setIsPromptsOpen} />)}
						</StyledAIPrompts>
					</StyledAIPromptsInner>
				</StyledAIPromptsWrapper>

				{/* User Input GUI: */}
				<StyledTextField variant='outlined' className={isListening ? 'active' : ''}>
					<FilledInput
						key={inputKey}
						id='message'
						inputRef={chatInputRef}
						type={'text'}
						// Show 'Listening...' during speech rec before 1st rec result:
						placeholder={isListening ? 'Listening...' : 'Write a message for Zeli...'}
						style={{ color: isListening ? theme.palette.primary.main : 'initial' }}
						multiline
						// Show the input field at size of 4 by default, allowing it to grow to 12:
						minRows={4}
						maxRows={8}
						// Don't allow text editing during speech recognition:
						readOnly={isListening}
						// Setting input text size to H5, so it's a little bigger -- if too large, then set it to body1 instead:
						inputProps={{ style: { fontSize: theme.typography.h5.fontSize } }}
						endAdornment={
							<InputAdornment position='end'>
								<StyledAIButtonWrapper>
									{/* Record Start/Stop button: */}
									{!isTyping != '' && (
										<StyledAIButton
											onMouseEnter={() => setMicHovered(true)}
											onMouseLeave={() => setMicHovered(false)}
											aria-label='toggle mic on/off'
											onMouseDown={() => {
												isPromptsOpen && setIsPromptsOpen(false);
												handleMicAction();
											}}
											loading={isProcessing && !isListening}
											className={isListening ? 'active-mic' : isProcessing ? 'loading-mic' : ''}
										>
											{isListening && !micHovered ? <MicNoneIcon className={isListening ? 'mic-animations' : null} /> : isListening && micHovered ? <StopIcon className={isListening ? 'mic-animations' : null} /> : isProcessing ? <></> : <MicNoneIcon />}
										</StyledAIButton>
									)}
									{/* Typed-text Submit button: */}
									{!isListening && !isProcessing && isTyping && (
										<IconButton
											className={'send-message-button'}
											aria-label='send message'
											onClick={() => {
												// console.log('Send')
												isPromptsOpen && setIsPromptsOpen(false);
												handleSendMessage({ messageInputValue: chatInputRef.current.value });
												setIsTyping(false);
												setInputKey((prevState) => prevState + 1);
											}}
										>
											<SendOutlinedIcon sx={{ color: 'white' }} />
										</IconButton>
									)}
									{!isListening && !isTyping ? (
										<IconButton
											onMouseDown={() => {
												handleUploadAction();
											}}
											aria-label='upload file'
										>
											<UploadFileIcon />
										</IconButton>
									) : null}
								</StyledAIButtonWrapper>
							</InputAdornment>
						}
						defaultValue={messageValue}
						onChange={(e) => {
							if (!isListening) {
								// debounceOnchangeMessage(e.target.value);
								// Check for non-whitespace text
								if (e.target.value.trim() !== '') {
									setIsTyping(true); // Set isTyping to true when non-whitespace text is entered
								} else {
									setIsTyping(false); // Set isTyping to false when text is empty or whitespace
								}
							}
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey && chatInputRef.current.value && !isListening) {
								isPromptsOpen && setIsPromptsOpen(false);
								handleSendMessage({ e, messageInputValue: chatInputRef.current.value });
								setIsTyping(false);
								setInputKey((prevState) => prevState + 1);
							}
							// Prevent default Enter key behavior when isListening is true:
							if (e.key === 'Enter' && isListening) {
								e.preventDefault();
							}
						}}
					/>
				</StyledTextField>
			</StyledAIInteractionPanel>
		);
	};

	return (
		<StyledAIDesktopLayout>
			{/* AI Helper Avatar: */}

			<Draggable bounds="body">
				<AIAvatar
					width={avatarSize}
					height={avatarSize}
					borderRadius='100%'
					style={avatarStyle}
					enableZoom={true}
					color={'#fff'}
					speaking={speaking}
					isListening={isListening}
					type={'video'}
					avatar={avatar}
					selectedAssistant={selectedAssistant}
					setSpeaking={setSpeaking}
					onMouseDown={handleResizeMouseDown}
					canPlay={educationModalHidden}
					filterVideoExecutionQueue={filterVideoExecutionQueue}
					videoExecutionQueue={videoExecutionQueue}
					muted={muted}
					className='ai-avatar'
				/>
			</Draggable>

			{/* Page Header: */}
			{/* <AIWorkerHeader showEducationModal={showEducationModal} openNav={open} onOpenNav={handleOpen} handleNotificationAction={handleNotificationAction} outputCardAction={outputCardAction} /> */}

			{/* Side Menu: */}
			{!isDesktop && <AIWorkerNavVertical openNav={open} onCloseNav={handleClose} actionHandler={sideMenuAction} extraConfig={workspacePrompts} isDesktop={isDesktop} />}
			{/* Main Content: */}
			<StyledAIDesktopLayoutContent component='main' open={open}>
				<AIWorkerHeader showEducationModal={showEducationModal} openNav={open} onOpenNav={handleOpen} onCloseNav={handleClose} handleNotificationAction={handleNotificationAction} outputCardAction={outputCardAction} />
				{/* Side Menu: */}
				{isDesktop && (
					<>
						<AIWorkerNavVertical openNav={open} onOpenNav={handleOpen} onCloseNav={handleClose} actionHandler={sideMenuAction} extraConfig={workspacePrompts} isDesktop={isDesktop} />

						<StyledAIDesktopLayoutContentWrapper open={open}>
							{/* Output Panel: */}
							{isDesktop && (
								<StyledAIOutputPanel>
									<StyledAIOutputWrapper ref={outputPanelRef}>{children}</StyledAIOutputWrapper>
								</StyledAIOutputPanel>
							)}

							{/* Draggable resize handle: */}
							{isDesktop && (
								<ResizeDragHangle onMouseDown={handleResizeMouseDown}>
									<ResizeDragHangleVerticalLine />
								</ResizeDragHangle>
							)}

							{/* Chat Panel: */}
							{renderChatPanel()}
						</StyledAIDesktopLayoutContentWrapper>
					</>
				)}
				{!isDesktop && <>{renderChatPanel()}</>}
			</StyledAIDesktopLayoutContent>
		</StyledAIDesktopLayout>
	);
}
