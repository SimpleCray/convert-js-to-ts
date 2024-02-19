import axios from '../utils/axios';
import { API_UPLOAD_DOCUMENT_MS } from '../config-global';

export const getDocumentContent = (targetpath) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(`${API_UPLOAD_DOCUMENT_MS}/${targetpath}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('#error: ', error);
				reject(error);
			});
	});
};

export const saveDocumentContent = (body) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(`${API_UPLOAD_DOCUMENT_MS}/document_content`, body)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};
