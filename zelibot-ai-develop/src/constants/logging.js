import axios from '../utils/axios';
import { LOGGING_API } from '../config-global';

const LOGGING_PAYLOAD = (type = 'INFO', logCategory, logSubCategory, ...other) => {
	return {
		type: type,
		logCategory: logCategory,
		logSubCategory: logSubCategory,
		...other,
	};
};

export const logUserSession = async (logPayload) => {
	try {
		const { width, height, colorDepth } = window.screen;
		const screenInfo = { width, height, colorDepth };
		const { userAgent, language, cookieEnabled } = navigator;
		const navigatorInfo = { userAgent, language, cookieEnabled };
		const thisWindowPayload = {
			host: window.location.host,
			hostName: window.location.hostname,
			href: window.location.href,
			origin: window.location.origin,
			pathName: window.location.pathname,
			port: window.location.port,
			protocol: window.location.protocol,
		};

		logPayload = {
			screenInfo: screenInfo,
			navigatorInfo: navigatorInfo,
			thisWindowPayload: thisWindowPayload,
			...logPayload,
		};

		const payload = LOGGING_PAYLOAD('INFO', 'USER', 'SESSION', logPayload);

		try {
			const response = await axios.post(LOGGING_API, payload);
			return response.data;
		} catch (error) {
			console.error('Error while sending log payload:', error);
			throw error;
		}
	} catch (error) {
		console.error('Error in logUserSession:', error);
		throw error;
	}
};
