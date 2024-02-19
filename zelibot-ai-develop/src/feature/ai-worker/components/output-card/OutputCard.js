import { Card, CardHeader, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Stack } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { StyledAvatar, StyledCardActions, StyledCardContent, StyledOutputCards, StyledOutputPromptsCardHeader, StyledPromptsCardContent, StyledATSOutputCard, CloseButton, CloseButtonATS } from './OutputCardStyles';
import propTypes from 'prop-types';
import {
	JobRequisitionOutputCard,
	CandidatesOutputCard,
	DefaultOutputCard,
	ViewResumeOutputCard,
	BestCandidateSummaryOutputCard,
	InterviewSummaryOutputCard,
	LiveInterviewSummaryOutputCard,
	EmploymentContractOutputCard,
	JobStatusOutputCard,
	OutputCardUpload,
	JobDescriptionListOutputCard,
	AnswerCard,
	FirstTimeATSOutputCard,
	QuicksightOutputCard,
	UploadJobDescriptionOutputCard,
	JobOpeningListOutputCard,
	JobOpeningOutputCard,
	FeatureUnsupportedOutputCard,
	DocumentsOutputCard,
	ClientListOutputCard,
	MockCard,
	CandidateProfileOutputCard,
	CandidateListOutputCard,
	PreScreeningSummaryOutputCard,
	RejectionEmailOutputCard,
	ShortListCandidateEmailOutputCard,
	EditDocumentContent,
	SoftwareUpdateCard,
	GenericCard,
} from './cards';
import { useState, useEffect, useRef } from 'react';
import FeatureNotAvailableOutputCard from './cards/FeatureNotAvailable';
import HtmlViewer from './cards/HtmlViewer';
import ProgressCard from './cards/ProgressCard';
import { Description, EmailRounded, PictureAsPdf, SaveAltRounded, CopyAll } from '@mui/icons-material';
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
import { useSnackbar } from 'notistack';
import CreateNewJobRevamp from './cards/CreateNewJobRevamp';
import InvitationEmail from './cards/InvitationEmail';
import PrescreeningOverview from './cards/PrescreeningOverview';
import UserFeedback from '../../../../components/user-feedback/UserFeedback';
import { useAIWorkerContext } from '../../AIWorker';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditClientCard from './cards/EditClientCard';

OutputCard.propTypes = {
	title: propTypes.any,
	titleIcon: propTypes.node,
	children: propTypes.node,
	actions: propTypes.node,
	showActions: propTypes.bool,
	showHeaderMenu: propTypes.bool,
	headerAction: propTypes.func,
	headerActionIcon: propTypes.node,
	isPromptCard: propTypes.bool,
	isATSCard: propTypes.bool,
	fixedWidth: propTypes.number,
};

export default function OutputCard({
	title,
	showTitle = true,
	titleIcon,
	children,
	actions,
	showActions = false,
	actionsDisabled = true,
	showHeaderMenu = false,
	headerAction,
	headerActionIcon,
	outputCardAction,
	clickRequestAction,
	data,
	id,
	text,
	isPromptCard = false,
	isATSCard = false,
	fixedWidth = null,
	wrapper,
	noTitleIcon = false,
	showClose,
	event_id,
	type,
	closeCard,
	...rest
}) {
	const { copy } = useCopyToClipboard();
	const { enqueueSnackbar } = useSnackbar();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [isEditMode, setIsEditMode] = useState(false);

	const [showCloseBtn, setShowCloseBtn] = useState(false);
	let timerToClose;

	const handleEmail = () => {
		outputCardAction(id, 'COMPOSE_EMAIL', text);
	};

	const handleEdit = () => {
		// outputCardAction(id, 'COMPOSE_TEXT', text);
		setIsEditMode(true);
	};

	const handleSMS = () => {
		outputCardAction(id, 'COMPOSE_SMS', text);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleConvertToPDF = () => {
		outputCardAction(id, 'CONVERT_TO_PDF', text);
		handleClose();
	};

	const handleCopyToClipboard = async () => {
		if (!text) return;

		// copy to clipboard
		if (await copy(text)) {
			enqueueSnackbar('Copied to clipboard ', { variant: 'success' });
		} else {
			enqueueSnackbar('Security settings prevent copying to clipboard', { variant: 'warning' });
		}
	};

	const renderDefaultActions = ({ type, event_id }) => (
		<Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ width: '100%' }}>
			<Stack direction='row'>
				{actionsDisabled ? null : (
					<Tooltip title='Copy'>
						<IconButton onClick={handleCopyToClipboard} disabled={actionsDisabled}>
							<CopyAll />
						</IconButton>
					</Tooltip>
				)}
				{/* <Tooltip title='Edit'>
				<IconButton onClick={handleEdit} disabled={actionsDisabled}>
					<EditRounded />
				</IconButton>
			</Tooltip> */}
				{actionsDisabled ? null : (
					<Tooltip title='Email'>
						<IconButton onClick={handleEmail} disabled={actionsDisabled}>
							<EmailRounded />
						</IconButton>
					</Tooltip>
				)}
				{/* <Tooltip title='SMS'>
				<IconButton onClick={handleSMS} disabled={actionsDisabled}>
					<SmsRounded />
				</IconButton>
			</Tooltip> */}
				{actionsDisabled ? null : (
					<Tooltip title={'Download'}>
						<IconButton onClick={handleClick} disabled={actionsDisabled}>
							<SaveAltRounded />
						</IconButton>
					</Tooltip>
				)}
				<Menu
					id='download-menu'
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				>
					<MenuItem onClick={handleConvertToPDF} disabled={actionsDisabled}>
						<ListItemIcon>
							<Description fontSize='small' />
						</ListItemIcon>
						Text
					</MenuItem>
					<MenuItem onClick={handleConvertToPDF} disabled={actionsDisabled}>
						<ListItemIcon>
							<PictureAsPdf fontSize='small' />
						</ListItemIcon>
						PDF
					</MenuItem>
				</Menu>
			</Stack>
			<Stack direction='row' alignItems='center' gap={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack>
		</Stack>
	);

	if (isATSCard) {
		return (
			<StyledATSOutputCard
				id={`output_${id}`}
				sx={{ ...(fixedWidth !== null && { maxWidth: (theme) => theme.spacing(fixedWidth) }) }}
				{...rest}
				onMouseEnter={(e) => {
					setShowCloseBtn(true);
					clearTimeout(timerToClose);
				}}
				onMouseLeave={(e) => {
					timerToClose = setTimeout(function () {
						setShowCloseBtn(false);
					}, 300);
				}}
			>
				{showTitle && (
					<StyledOutputPromptsCardHeader
						avatar={noTitleIcon ? null : <StyledAvatar variant='rounded'>{titleIcon ? titleIcon : <WorkOutlineIcon />}</StyledAvatar>}
						title={title}
						action={
							showHeaderMenu && (
								<IconButton aria-label='settings' onClick={headerAction}>
									{headerActionIcon ? headerActionIcon : <MoreVertIcon />}
								</IconButton>
							)
						}
					/>
				)}
				{closeCard && showCloseBtn && !showClose && (
					<div>
						<CloseButtonATS aria-label='close' size='small' color='primary' onClick={closeCard}>
							<CloseOutlinedIcon fontSize='' />
						</CloseButtonATS>
					</div>
				)}

				<StyledPromptsCardContent>{showTitle ? <div className={'body'}>{children}</div> : children}</StyledPromptsCardContent>
				{showActions && <StyledCardActions>{actions ? actions : renderDefaultActions({ type, event_id })}</StyledCardActions>}
			</StyledATSOutputCard>
		);
	}

	return (
		<Card
			id={`output_${id}`}
			sx={{ width: '100%', maxWidth: '1200px' }}
			onMouseEnter={(e) => {
				setShowCloseBtn(true);
				clearTimeout(timerToClose);
			}}
			onMouseLeave={(e) => {
				timerToClose = setTimeout(function () {
					setShowCloseBtn(false);
				}, 300);
			}}
		>
			{showTitle && (
				<CardHeader
					avatar={<StyledAvatar variant='rounded'>{titleIcon ? titleIcon : <WorkOutlineIcon />}</StyledAvatar>}
					title={title}
					action={
						showHeaderMenu && (
							<IconButton aria-label='settings' onClick={headerAction}>
								{headerActionIcon ? headerActionIcon : <MoreVertIcon />}
							</IconButton>
						)
					}
				/>
			)}
			{closeCard && showCloseBtn && (
				<div>
					<CloseButton aria-label='close' size='small' color='primary' onClick={closeCard}>
						<CloseOutlinedIcon fontSize='' />
					</CloseButton>
				</div>
			)}
			<StyledCardContent>{showTitle ? <div className={'body'}>{children}</div> : children}</StyledCardContent>
			{showActions && <StyledCardActions>{actions ? actions : renderDefaultActions({ type, event_id })}</StyledCardActions>}
		</Card>
	);
}

export function OutputCards({
	outputCards,
	setOutputCards,
	outputCardAction,
	clickRequestAction,
	promptAction,
	avatarChatResponse,
	currentOutputCardId,
	writingContent,
	prompts,
	leftPrompts,
	setIsPromptsOpen,
	userHasScrolled,
	workspaceScrollPosition,
	requestId,
	conversationGuid,
	handleCardClose,
	preventToScrollToBottomRef,
}) {
	const outputAnchorRef = useRef(null);
	const outputStartRef = useRef(null);
	const outputCardContainerRef = useRef(null);
	const [outputCardsLength, setOutputCardsLength] = useState(outputCards.length);
	const [manualScroll, setManualScroll] = useState(true);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const [isScrollingToBottom, setIsScrollingToBottom] = useState(false);
	const [generatedAvatarResponse, setGeneratedAvatarResponse] = useState('');

	const handleScrollToBottom = () => {
		// setTimeout(() =>
		setIsScrollingToBottom(true)
		outputCardContainerRef?.current?.scrollTo(0, outputCardContainerRef?.current?.scrollHeight + 1000)
		// , 250)
	}

	useEffect(() => {
		const scrollFunction = (e) => {
			let scrollTopValue = outputCardContainerRef?.current?.scrollTop;
			let clientHeightValue = outputCardContainerRef?.current?.clientHeight;
			let scrollHeight = outputCardContainerRef?.current?.scrollHeight;
			// console.log('Scroll values ', outputCardContainerRef?.current?.scrollTop + outputCardContainerRef?.current?.clientHeight, outputCardContainerRef?.current?.scrollHeight);
			const isAtBottom = scrollTopValue === (scrollHeight - clientHeightValue);
			const isCloseToBottom = Math.abs(scrollTopValue - (scrollHeight - clientHeightValue)) < 120;
			// console.log('Is close to bottom value is >>> ', isCloseToBottom, Math.abs(scrollTopValue - (scrollHeight - clientHeightValue)));
			if (isCloseToBottom) {
				setIsAtBottom(true)
			} else {
				setIsAtBottom(false)
			}
			if (isAtBottom) {
				setManualScroll(false)
				return
			}
			else {
				if (Math.abs((scrollTopValue + clientHeightValue) - scrollHeight) > 65) {
					setManualScroll(true);
				}
			}
			return
		}

		const scrollEndFunction = () => {
			setIsScrollingToBottom(false);
		}

		if (outputCardContainerRef?.current) {
			outputCardContainerRef?.current?.addEventListener('scroll', scrollFunction)
			outputCardContainerRef?.current?.addEventListener('scrollend', scrollEndFunction)
		}

		return () => {
			outputCardContainerRef?.current?.removeEventListener('scroll', scrollFunction)
			outputCardContainerRef?.current?.removeEventListener('scrollend', scrollEndFunction)
		}
	}, [outputCardContainerRef?.current])

	useEffect(() => {
		if (outputCards.length > outputCardsLength) {
			outputCardContainerRef?.current?.scrollTo(0, outputCardContainerRef?.current?.scrollHeight)
		}
		setOutputCardsLength(outputCards.length);
	}, [outputCards.length])

	useEffect(() => {
		// Setting the bare minimum avatar chat response to get a height for output card,
		if (avatarChatResponse?.length <= 75) {
			setGeneratedAvatarResponse(avatarChatResponse);
		}
		// After a certain period, if user scrolls up, I am stopping the card content generation. Once he goes back to the bottom,
		// the content will resume.
		if (!isScrollingToBottom && isAtBottom) {
			setGeneratedAvatarResponse(avatarChatResponse);
		}

		if (!manualScroll && writingContent && avatarChatResponse) {
			// outputCardContainerRef?.current?.scrollTo(0, outputCardContainerRef?.current?.scrollHeight)
			outputAnchorRef?.current?.scrollIntoView({
				behavior: 'instant',
				block: 'end'
			})
		}
	}, [avatarChatResponse, isScrollingToBottom])

	return (
		<StyledOutputCards ref={outputCardContainerRef}>
			<div ref={outputStartRef}></div>
			{outputCards.map((outputCard) => (
				<OutputCardContent
					key={outputCard?.id}
					outputCardsLength={outputCards?.length ? outputCards?.length : 0}
					outputCard={outputCard}
					outputCardAction={outputCardAction}
					clickRequestAction={clickRequestAction}
					promptAction={promptAction}
					avatarChatResponse={generatedAvatarResponse}
					currentOutputCardId={currentOutputCardId}
					writingContent={writingContent}
					prompts={prompts}
					setOutputCards={setOutputCards}
					outputCards={outputCards}
					leftPrompts={leftPrompts}
					setIsPromptsOpen={setIsPromptsOpen}
					userHasScrolled={userHasScrolled}
					handleCardClose={handleCardClose}
					requestId={requestId}
					conversationGuid={conversationGuid}
				/>
			))}
			{
				!isAtBottom && outputCards.length > 1
				&&
				<Tooltip title={'Scroll to bottom'} placement='left'>
					<Stack justifyContent={'center'} alignItems={'center'}
						onClick={() => handleScrollToBottom()}
						sx={{
							position: 'absolute',
							bottom: '16px',
							right: '16px',
							backgroundColor: '#FFFFFF',
							borderRadius: '50%',
							width: '24px',
							height: '24px',
							zIndex: 10,
							boxShadow: '0px 2px 5px rgba(0,0,0,0.7)',
							cursor: 'pointer',
							transition: '0.5s ease'
						}}>
						<KeyboardArrowDownIcon sx={{ color: '#3B0099' }} />
					</Stack>
				</Tooltip>
			}
			<div id="outputAnchorRefBottom" style={{ marginTop: '10px', width: '100%', height: '1px' }} ref={outputAnchorRef}></div>
		</StyledOutputCards>
	);
}

function OutputCardContent({ outputCard, outputCards, outputCardsLength, setOutputCards, outputCardAction, promptAction, clickRequestAction, avatarChatResponse, currentOutputCardId, writingContent, prompts, leftPrompts, setIsPromptsOpen, data, userHasScrolled, handleCardClose, conversationGuid, requestId }) {
	const { sourceLinks = [] } = useAIWorkerContext();
	// Store the avatarChatResponse in state so that it can be streamed to the next output card
	const [storedAvatarChatResponse, setStoredAvatarChatResponse] = useState(null);
	const [storedSourceLinks, setStoredSourceLinks] = useState([]);
	useEffect(() => {
		// console.log('Avatar Chat Response is 1 >>> ', outputCard);
		if (avatarChatResponse && currentOutputCardId === outputCard?.id) {
			setStoredAvatarChatResponse(avatarChatResponse);
		}
		if (outputCard?.type === 'DEFAULT' && outputCard?.assistantMessage) {
			// console.log('Avatar Chat Response is 2 >>> ', outputCard);
			setStoredAvatarChatResponse(outputCard?.assistantMessage);
		}
		if (sourceLinks && currentOutputCardId === outputCard?.id && storedSourceLinks?.length === 0) {
			setStoredSourceLinks(sourceLinks.filter((item) => item.url !== ""));
		}
	}, [avatarChatResponse, sourceLinks]);

	if (outputCard?.type === 'JOB_REQUISITION' || outputCard?.type === 'WSC_TEXT_EDITOR' || outputCard?.type === 'LINKEDIN_JOB_AD') {
		return <JobRequisitionOutputCard showActions={false} {...outputCard} body={storedAvatarChatResponse} outputCardAction={outputCardAction} writingContent={writingContent} userHasScrolled={userHasScrolled} handleCardClose={handleCardClose} clickRequestAction={clickRequestAction} />;
	} else if (outputCard?.type === 'CANDIDATE_LIST') {
		return <CandidatesOutputCard {...outputCard} outputCardAction={outputCardAction} clickRequestAction={clickRequestAction} writingContent={writingContent} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'PROGRESS_CARD') {
		return <ProgressCard {...outputCard} outputCardAction={outputCardAction} writingContent={writingContent} />;
	} else if (outputCard?.type === 'JOB_DESCRIPTION_LIST') {
		return <JobDescriptionListOutputCard {...outputCard} outputCardAction={outputCardAction} writingContent={writingContent} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'VIEW_DOCUMENT') {
		return <ViewResumeOutputCard {...outputCard} clickRequestAction={clickRequestAction} outputCardAction={outputCardAction} conversationGuid={conversationGuid} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'VIEW_JOB_DESCRIPTION') {
		return <ViewResumeOutputCard {...outputCard} outputCardAction={outputCardAction} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'BEST_CANDIDATE_SUMMARY') {
		return <BestCandidateSummaryOutputCard {...outputCard} outputCardAction={outputCardAction} writingContent={writingContent} handleCardClose={handleCardClose} />;
		// } else if (outputCard?.type === 'LINKEDIN_JOB_AD') {
		// return <LinkedinJobAdOutputCard {...outputCard} body={storedAvatarChatResponse} outputCardAction={outputCardAction} writingContent={writingContent} />;
	} else if (outputCard?.type === 'INTERVIEW_SUMMARY') {
		return <InterviewSummaryOutputCard {...outputCard} outputCardAction={outputCardAction} writingContent={writingContent} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'LIVE_INTERVIEW_SUMMARY') {
		return <LiveInterviewSummaryOutputCard {...outputCard} outputCardAction={outputCardAction} writingContent={writingContent} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'EMPLOYMENT_CONTRACT') {
		return <EmploymentContractOutputCard {...outputCard} outputCardAction={outputCardAction} writingContent={writingContent} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'JOB_STATUS') {
		return <JobStatusOutputCard {...outputCard} outputCardAction={outputCardAction} writingContent={writingContent} conversationGuid={conversationGuid} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'UPLOAD_FILES') {
		return <OutputCardUpload {...outputCard} outputCardAction={outputCardAction} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'FEATURE_NOT_AVAILABLE') {
		return <FeatureNotAvailableOutputCard {...outputCard} outputCardAction={outputCardAction} writingContent={writingContent} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'HTML_VIEWER') {
		return <HtmlViewer showTitle={false} outputCardAction={outputCardAction} body={outputCard.data} writingContent={writingContent} {...outputCard} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'CHAT') {
		return <AnswerCard id={outputCard?.id} cardContent={outputCard?.body} writingContent={writingContent} />;
	} else if (outputCard?.type === 'FIRST_TIME_ATS') {
		return <FirstTimeATSOutputCard {...outputCard} outputCardAction={promptAction} clickRequestAction={clickRequestAction} prompts={leftPrompts} setIsPromptsOpen={setIsPromptsOpen} />;
	} else if (outputCard?.type === 'CREATE_JOB_OPENING') {
		return <CreateNewJobRevamp outputCardAction={outputCardAction} {...outputCard} handleCardClose={handleCardClose} conversationGuid={conversationGuid} />;
		// return <CreateNewJobOutputCard outputCardAction={outputCardAction} {...outputCard} />;
	} else if (outputCard?.type === 'CREATE_JOB_DESCRIPTION_CHOICE') {
		return; // Temp. We want _only_ prompts and no card
	} else if (outputCard?.type === 'UPLOAD_JOB_DESCRIPTION') {
		return <UploadJobDescriptionOutputCard {...outputCard} outputCardAction={outputCardAction} />;
	} else if (outputCard?.type === 'WSC_OPEN_JOB_LISTINGS' || outputCard?.type === 'JOB_OPENINGS') {
		return <JobOpeningListOutputCard {...outputCard} outputCardAction={outputCardAction} clickRequestAction={clickRequestAction} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'WSC_JOB_STATUS' || outputCard?.type === 'JOB_OPENING') {
		return <JobOpeningOutputCard {...outputCard} outputCardAction={outputCardAction} clickRequestAction={clickRequestAction} includeCandidates={true} enableCandidateFiltering={true} showContactBox={false} handleCardClose={handleCardClose} conversationGuid={conversationGuid} />;
	} else if (outputCard?.type === 'FEATURE_UNSUPPORTED') {
		return <FeatureUnsupportedOutputCard {...outputCard} outputCardAction={outputCardAction} />;
	} else if (outputCard?.type === 'USER_DOCUMENTS') {
		return <DocumentsOutputCard {...outputCard} outputCardAction={outputCardAction} clickRequestAction={clickRequestAction} conversationGuid={conversationGuid} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'CLIENT_LIST') {
		return <ClientListOutputCard {...outputCard} outputCardAction={outputCardAction} handleCardClose={handleCardClose} clickRequestAction={clickRequestAction} />;
	} else if (outputCard?.type === 'WSC_CANDIDATE_LIST') {
		return <CandidateListOutputCard {...outputCard} outputCardAction={promptAction} clickRequestAction={clickRequestAction} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'WSC_CANDIDATE_PROFILE') {
		return <CandidateProfileOutputCard {...outputCard} outputCardAction={outputCardAction} clickRequestAction={clickRequestAction} conversationGuid={conversationGuid} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'WSC_CANDIDATE_APPLICATION_EMAIL_INVITATION') {
		return <InvitationEmail outputCards={outputCards} setOutputCards={setOutputCards} {...outputCard} outputCardAction={outputCardAction} clickRequestAction={clickRequestAction} editable handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'QUICKSIGHT') {
		return <QuicksightOutputCard dashboard='candidates' {...outputCard} />;
	} else if (outputCard?.type === 'PRE_SCREENING_SUMMARY') {
		return <PreScreeningSummaryOutputCard outputCardsLength={outputCardsLength} {...outputCard} clickRequestAction={clickRequestAction} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'TEMP') {
		return <MockCard {...outputCard} />;
	} else if (outputCard?.type === 'PRE_SCREENING_OVERVIEW') {
		return <PrescreeningOverview {...outputCard} outputCardAction={outputCardAction} clickRequestAction={clickRequestAction} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'WSC_REJECTION_EMAIL') {
		return <RejectionEmailOutputCard {...outputCard} outputCardAction={outputCardAction} editable handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'WSC_SHORTLIST_CANDIDATE_EMAIL') {
		return <ShortListCandidateEmailOutputCard {...outputCard} outputCardAction={outputCardAction} editable handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'DOCUMENT_CONTENT') {
		return <EditDocumentContent {...outputCard} outputCardAction={outputCardAction} editable conversationGuid={conversationGuid} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'CLIENT_DETAILS') {
		return <EditClientCard {...outputCard} isEditing={false} outputCardAction={outputCardAction} readOnly={true} clientDataProp={outputCard?.client_data} conversationGuid={conversationGuid} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'SOFTWARE_UPDATE') {
		return <SoftwareUpdateCard {...outputCard} outputCardAction={outputCardAction} clickRequestAction={clickRequestAction} handleCardClose={handleCardClose} />;
	} else if (outputCard?.type === 'GENERIC_CARD') {
		return (
			<GenericCard
				showActions={false}
				{...outputCard}
				body={storedAvatarChatResponse}
				outputCardAction={outputCardAction}
				clickRequestAction={clickRequestAction}
				storedSourceLinks={storedSourceLinks}
				writingContent={writingContent}
				userHasScrolled={userHasScrolled}
				requestId={requestId}
				handleCardClose={handleCardClose}
			/>
		);
	} else {
		return <DefaultOutputCard showTitle={false} clickRequestAction={clickRequestAction} body={storedAvatarChatResponse} storedSourceLinks={storedSourceLinks} writingContent={writingContent} {...outputCard} />;
	}
}
