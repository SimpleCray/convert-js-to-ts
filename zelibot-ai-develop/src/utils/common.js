import { AIGetAPIRequest } from '../feature/ai-worker/constants';

export const getAPIAndEndpointFromCompoundComponent = (compoundComponent) => {
	const { target_api_endpoint, target_path } = compoundComponent;
	const API = process.env[`API_${target_api_endpoint}`];
	const endpoint = `${API}/${target_path}`;
	return { API, endpoint };
};

export const getCompoundComponentPromiseBySectionName = (compound_component, section_name) => {
	const compoundComponent = compound_component.find((item) => item?.section_name === section_name);
	if (compoundComponent) {
		const { endpoint } = getAPIAndEndpointFromCompoundComponent(compoundComponent);
		return { promise: AIGetAPIRequest(endpoint), endpoint };
	}
	return null;
};

export const getSourceUrl = async ({ source_type = 1, url }) => {
	try {
		const path = 'info-source-ms';
		const endpoint = process.env['SOURCE'];
		const API = `${endpoint}/${path}?source_type=${source_type}&source_url=${url}`;
		const response = await AIGetAPIRequest(API);
		return response;
	} catch (err) {
		return null;
	}
};

export function utf8ToBase64(str) {
	// First, encodeURIComponent to get percent-encoded UTF-8,
	// then convert the percent encodings into raw bytes which
	// can be fed into btoa.
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
		function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1);
	}));
  }
