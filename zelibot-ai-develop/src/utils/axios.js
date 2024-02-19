import axios from 'axios';
// config
import { HOST_API_KEY } from '../config-global';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const axiosInstance = axios.create({
	baseURL: HOST_API_KEY,
	timeout: 90000, // increase timeout to 90 seconds
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('Error details:', error);
		console.error('Error message:', error.message);
		console.error('Error code:', error.code);
		return Promise.reject((error.response && error.response.data) || '[25] Something went wrong but we have stored any results in the History section.');
	}
);

export default axiosInstance;
