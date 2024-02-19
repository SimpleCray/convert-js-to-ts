import axios from '../../../utils/axios';
import { USER_API, CHAT_ANIMATION_MS, APP_VERSION_API, CONTEXT_BASE_API } from '../../../config-global';

export const AIGetAPIRequest = (api_url) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(api_url)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const AIPostAPIRequest = (url, payload) => {
	// console.log('#url', url);
	// console.log('#payload', payload);
	return new Promise(async (resolve, reject) => {
		await axios
			.post(url, payload)
			.then((response) => {
				resolve(response.data);
				// console.log('response', response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getSelectedAssistantId = () => {
	return new Promise((resolve, reject) => {
		axios
			.get(USER_API)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getChatAnimation = (action, conversation_guid, actionText) => {
	const payload = {
		'action_id': action,
		'conversation_id': conversation_guid,
		'action_text': actionText
	}
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${CHAT_ANIMATION_MS}`, payload)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
}

export const getSoftwareNewVersion = () => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(APP_VERSION_API + `/current_version?pk=current_version&sk=1`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
}

export const setChatContext = (payload) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${CONTEXT_BASE_API}/set_chat_context`, payload)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
}
