import axios from '../../../utils/axios';
import { GET_ASSISTANTS_API, USER_API, BASE_USER_API } from '../../../config-global';

export const getAssistants = (key) => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${GET_ASSISTANTS_API}?pk=` + key + `&sk=1`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const postAssistantId = (id) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`${USER_API}`, { assistant_id: id })
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};

export const getUserType = () => {
	return new Promise((resolve, reject) => {
		axios
			.get(`${USER_API}`)
			.then((response) => {
				resolve(response);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};
