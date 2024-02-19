import axios from '../utils/axios';
import { API_GET_COMPANY_DETAILS, API_POST_COMPANY_DETAILS } from '../config-global';

export const getCompanyDetails = ({ url }) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.get(`${API_GET_COMPANY_DETAILS}?url=${encodeURIComponent(url)}`)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('#error: ', error);
				reject(error);
			});
	});
};

export const postCompanyDetails = (details) => {
	return new Promise(async (resolve, reject) => {
		await axios
			.post(API_POST_COMPANY_DETAILS, details)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				console.error('error: ', error);
				reject(error);
			});
	});
};
