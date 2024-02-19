import axios from '../../../utils/axios';
import { HUMAN_RESOURCES, ZELI_EDITOR_API } from '../../../config-global';

export const getChatHistoryByAssistantId = (assistant_id) => {
	const this_assistant_id = assistant_id === undefined ? 1 : assistant_id;
	const url = `${HUMAN_RESOURCES.HUMAN_RESOURCES_API}/history?assistant_id=${this_assistant_id}`;
	return new Promise(async (resolve, reject) => {
		await axios
			.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getConversationHistory = (assistant_id, conversation_guid) => {
	const url = `${HUMAN_RESOURCES.HUMAN_RESOURCES_API}/conversation_history?assistant_id=${assistant_id}&conversation_guid=${conversation_guid}`;
	return new Promise(async (resolve, reject) => {
		await axios
			.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getTextToVoiceSignedURL = (sk) => {
	const url = sk ? `${ZELI_EDITOR_API.TEXT_TO_VOICE}?sk=${sk}` : ZELI_EDITOR_API.TEXT_TO_VOICE;
	return new Promise(async (resolve, reject) => {
		await axios
			.get(url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};
