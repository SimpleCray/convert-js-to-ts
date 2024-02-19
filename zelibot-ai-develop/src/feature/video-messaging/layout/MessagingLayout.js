import { AIWorkerHeader, StyledAIDesktopLayout, StyledVideoChatVideoPanel } from '../../ai-worker';
import { useEffect, useRef, useState } from 'react';
import { StyledAIInteractionPanel, StyledAIDialogueWrapper, StyledAIDesktopLayoutContent, ResizeDragHangle, ResizeDragHangleVerticalLine } from './MessagingLayoutStyles';
import DialogueCard from '../../ai-worker/components/dialogue-card';
import { useTheme } from '@mui/material/styles';
import { CONVERSATION_TYPE } from '../VideoMessaging';
import useResponsive from '../../../hooks/useResponsive';
import PropTypes from 'prop-types';

MessagingLayout.propTypes = {
	children: PropTypes.node,
	isPreScreeningScreen: PropTypes.bool,
	conversationInfo: PropTypes.object,
};

export default function MessagingLayout({ children, isPreScreeningScreen, conversationInfo }) {
	// Component implementation
	const isDesktop = useResponsive('up', 'md');
	const theme = useTheme();

	const chatPanelWidthMinimum = 200;
	const chatPanelWidthDefault = isPreScreeningScreen ? 600 : 400;
	const chatPanelWidthMaximum = 1000;
	const [chatPanelWidth, setChatPanelWidth] = useState(chatPanelWidthDefault);


	let bottomspacing = theme.spacing(0); // no spacing between chat messages in a series

	const [open, setOpen] = useState(false);

	const chatPanelRef = useRef('');
	const videoPanelRef = useRef('');

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// ------------------------------------------------------------------------
	// Chat Panel resize functionality:

	const handleResizeMouseDown = (e) => {
		// console.log('123');
		document.addEventListener('mousemove', handleResizeMouseMove);
		document.addEventListener('mouseup', handleResizeMouseUp);

		chatPanelRef.current.style.setProperty('user-select', 'none');
		videoPanelRef.current.style.setProperty('user-select', 'none');
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
	}, [chatPanelWidth]); // Dependency array: this effect runs when chatPanelWidth changes

	const handleResizeMouseUp = () => {
		document.removeEventListener('mousemove', handleResizeMouseMove);
		document.removeEventListener('mouseup', handleResizeMouseUp);

		chatPanelRef.current.style.setProperty('user-select', 'auto');
		videoPanelRef.current.style.setProperty('user-select', 'auto');
	};

	const handleResize = () => {
		const actualChatPanelWidth = chatPanelRef.current.offsetWidth;
		setChatPanelWidth(actualChatPanelWidth);
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [chatPanelWidth, chatPanelWidthMinimum, chatPanelWidthMaximum]);

	// ------------------------------------------------------------------------
	// Chat Panel auto-scroll:

	const dialogueAnchorRef = useRef(null); // < Div at bottom to scroll to
	useEffect(() => {
		// console.log('[VC] AUTO SCROLL >> useEffect triggered');

		const autoScrollFunction = () => {
			dialogueAnchorRef?.current?.scrollIntoView({
				block: 'end',
			});
		};

		// Ensure scroll happens after DOM has been updated,
		// otherwise the auto-scroll is not robust:
		requestAnimationFrame(autoScrollFunction);
	}, [conversationInfo]);

	// ------------------------------------------------------------------------
	// GUI Layout:

	return (
		<StyledAIDesktopLayout>
			{isPreScreeningScreen ? null : <AIWorkerHeader showEducationModal={false} onOpenNav={handleOpen} hideNavBar />}
			<StyledAIDesktopLayoutContent component='main' className={'m-padded'} isPreScreeningScreen={isPreScreeningScreen}>
				{/* Video Panel on the left side: */}
				<StyledVideoChatVideoPanel ref={videoPanelRef}>{children}</StyledVideoChatVideoPanel>

				{/* Draggable resize handle: */}
				{isDesktop && (
					<ResizeDragHangle onMouseDown={handleResizeMouseDown}>
						<ResizeDragHangleVerticalLine />
					</ResizeDragHangle>
				)}

				{/* Chat Messages on the right side: */}
				<StyledAIInteractionPanel ref={chatPanelRef} style={{ width: `${chatPanelWidth}px`, minWidth: `${chatPanelWidth}px` }}>
					<StyledAIDialogueWrapper>
						{conversationInfo?.conversation?.length > 0
							? conversationInfo?.conversation?.map((item, index) =>
									item.type === CONVERSATION_TYPE.AI ? (
										<div key={index} style={{ flex: 9, marginLeft: theme.spacing(1), marginRight: theme.spacing(5), marginBottom: bottomspacing }}>
											<DialogueCard type={CONVERSATION_TYPE.AI} cardContent={item?.text} shape={'single'} />
										</div>
									) : (
										<div key={index} style={{ flex: 9, marginLeft: theme.spacing(5), marginRight: theme.spacing(1), marginBottom: bottomspacing }}>
											<DialogueCard type={CONVERSATION_TYPE.USER} cardContent={item?.text} shape={'single'} />
										</div>
									)
								)
							: null}
						<div ref={dialogueAnchorRef} height={theme.spacing(2)} />
					</StyledAIDialogueWrapper>
				</StyledAIInteractionPanel>
				
			</StyledAIDesktopLayoutContent>
		</StyledAIDesktopLayout>
	);
}
