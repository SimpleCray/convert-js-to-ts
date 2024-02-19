import { HUMAN_RESOURCES } from '../../../config-global';
import { Typography } from '@mui/material';
import { utf8ToBase64 } from 'src/utils/common';

function font_check(guid) {
	let sum = 0;
	for (const char of guid) {
		if (/\d/.test(char)) {
			sum += parseInt(char, 10);
		}
	}

	return sum;
}

function font_color() {
	return Math.floor(Date.now() / 1000);
}

export const AIWebsocketPayload = (action = 'DEFAULT', messageValue, user, conversationGuid, selectedAssistantValue, eventId, clickRequest, action_text, is_new_conversation = null) => {
	// console.log('Message Value in AIWebsocketPayload is ', messageValue)
	return {
		MessageGroupId: '1',
		action: action,
		action_text: action_text,
		data: {
			chat_request: btoa(utf8ToBase64(messageValue)),
			user_id: `${user.signInUserSession.idToken.payload.sub}`,
			user_email: `${user.email}`,
			conversation_guid: conversationGuid,
			event_id: eventId,
			click_request: clickRequest,
			is_new_conversation: is_new_conversation,
		},
	};
};

export const AIWebsocketUrl = (authorizer_key) => {
	return `${HUMAN_RESOURCES.HUMAN_RESOURCES_WS}?auth_header=https://auth/${authorizer_key}/post/${font_check(authorizer_key)}/${font_color()}`;
};

export const FormatMessageResponse = (message) => {
	if (!message) return null;

	// If message contains \n, split it into an array and render each line on a new line
	if (message.includes('\n')) {
		const messageArray = message.split('\n');
		return messageArray.map((message, index) => (
			<Typography key={index} variant={'body1'} gutterBottom>
				{message}
			</Typography>
		));
	}
};
