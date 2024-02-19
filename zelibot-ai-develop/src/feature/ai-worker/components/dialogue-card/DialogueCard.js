import { CardContent, Typography, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CONVERSATION_TYPE } from '../../../video-messaging/VideoMessaging';
import { keyframes } from '@emotion/react';

export default function DialogueCard({ type = 'answer', width = '100%', cardContent = '', shape = 'single' }) {
	const theme = useTheme();
	const cardStyle = { marginTop: 'auto', marginBottom: 'auto' };

	if (type === CONVERSATION_TYPE.AI || type === 'ThinkingZeli') {
		if (type === 'ThinkingZeli') {
			cardStyle.width = 'fit-content';
			cardStyle.margin = '0px 0px 8px 0px';
		}
		cardStyle.border = '1px solid #fff';
		cardStyle.backgroundColor = 'rgba(255,255,255,0)';
		cardStyle.color = '#fff';
		cardStyle.overflow = 'hidden';
		switch (shape) {
			case 'single':
				cardStyle.borderRadius = '0 16px 16px 16px';
				break;
			case 'first':
				cardStyle.borderRadius = '0 16px 0 0';
				cardStyle.borderBottom = 'none';
				break;
			case 'mid':
				cardStyle.borderTop = 'none';
				cardStyle.borderRadius = '0 0 0 0';
				cardStyle.borderBottom = 'none';
				break;
			case 'last':
				cardStyle.borderTop = 'none';
				cardStyle.borderRadius = '0 0 16px 16px';
				break;
		}
	} else {
		cardStyle.backgroundColor = 'rgba(255,255,255,0.7)';
		switch (shape) {
			case 'single':
				cardStyle.borderRadius = '16px 16px 0 16px';
				break;
			case 'first':
				cardStyle.borderRadius = '16px 16px 0 0';
				cardStyle.borderBottom = 'none';
				break;
			case 'mid':
				cardStyle.borderTop = 'none';
				cardStyle.borderRadius = '0 0 0 0';
				cardStyle.borderBottom = 'none';
				break;
			case 'last':
				cardStyle.borderTop = 'none';
				cardStyle.borderRadius = '0 0 0 16px';
				break;
		}
	}

	const bubble = keyframes`
	0% {
		transform: translateY(0%);
	}
	50% {
		transform: translateY(-12px);
	}
	100% {
		transform: translateY(0%);
	}
`;


	if (type === 'ThinkingZeli') {
		return (
			<Box sx={{ width: width, position: 'relative', left: '8px' }} style={{ display: 'flex', flexDirection: 'column', ...cardStyle }}>
				<Stack gap={0.5} flexDirection={'row'} alignItems={'flex-end'} px={2} pt={3} pb={1}>
					<Box sx={{ animation: `${bubble} 0.75s infinite 0s`, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }}></Box>
					<Box sx={{ animation: `${bubble} 0.75s infinite 0.1s`, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }}></Box>
					<Box sx={{ animation: `${bubble} 0.75s infinite 0.2s`, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }}></Box>
				</Stack>
			</Box>
		)
	}

	return (
		<Box sx={{ width: width }} style={{ height: '100%', display: 'flex', flexDirection: 'column', ...cardStyle }}>
			<CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				<Typography variant='chatmessage' component={'div'} style={{ margin: -8, marginTop: -8, marginBottom: -8 }}>
					{cardContent}
				</Typography>
			</CardContent>
		</Box>
	);
}

export function DialoguePromptCards({ id, type, body, shape }) {
	const theme = useTheme();

	let bottomspacing = theme.spacing(0); // no spacing between chat messages in a series
	if (shape === 'single' || shape === 'last') {
		bottomspacing = theme.spacing(1); // default spacing between chat messages from different actors
	}

	// AI messages aligned left, user messages aligned right:
	return (
		body &&
		<Box id={id && `dialogue_${id}`} sx={{ flexGrow: 1, display: 'flex' }}>
			{(type === 'ASSISTANT') ? (
				<div style={{ flex: 9, marginLeft: theme.spacing(1), marginRight: theme.spacing(5), marginBottom: bottomspacing }}>
					<DialogueCard type='AI' cardContent={body} shape={shape} />
				</div>
			)
				:
				null
			}

			{type === 'USER' && (
				<div style={{ flex: 9, marginLeft: theme.spacing(5), marginRight: theme.spacing(1), marginBottom: bottomspacing }}>
					<DialogueCard type='User' cardContent={body} shape={shape} />
				</div>
			)}
		</Box>
	);
}
