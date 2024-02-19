import { S3Client } from '@aws-sdk/client-s3';

export const APP_NAME = 'Zeligate';

export const APP_VERSION = 'version 2.2.2';

export const APP_SUPPORT_EMAIL = 'support@zelibot.ai';

export const NOTIFICATIONS_TIMEOUT = 30; // seconds
export const SPEECH_RECOGNITION_TIMEOUT = 30; // seconds

export const HOST_API_KEY = process.env['HOST_API_KEY'] || '';

export const LOGGING_API = process.env['API_LOGGING_AI'];

export const COGNITO_API = {
	userPoolId: process.env['AWS_COGNITO_USER_POOL_ID'],
	clientId: process.env['AWS_COGNITO_CLIENT_ID'],
	region: process.env['AWS_REGION'],
	identityPoolId: process.env['AWS_COGNITO_IDENTITY_POOL_ID'],
};

export const AWS_API = {
	region: process.env['AWS_REGION'],
	accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
	secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
	s3UploadBucket: process.env['AWS_S3_UPLOAD_BUCKET'],
};

export const ZELI_EDITOR_API = {
	ZELI_EDITOR: process.env['API_ZELI_EDITOR'],
	HISTORY: process.env['API_ZELI_EDITOR_HISTORY'],
	TEXT_TO_VOICE: process.env['API_ZELI_EDITOR_TEXT_TO_VOICE'],
};

export const USER_API = process.env['API_USER_AI'];
export const BASE_USER_API = process.env['API_USER_AI_BASE'];

export const GET_ASSISTANTS_API = process.env['API_GET_ASSISTANTS_AI'];

export const NOTIFICATION_API = process.env['API_NOTIFICATION_AI'];

export const API_GET_COMPANY_DETAILS = process.env['API_GET_COMPANY_DETAILS'];
export const API_POST_COMPANY_DETAILS = process.env['API_POST_COMPANY_DETAILS'];

export const API_GET_CLIENTS = process.env['API_GET_CLIENTS'];
export const API_UPDATE_CLIENTS = process.env['API_UPDATE_CLIENT'];
export const API_DELETE_CLIENT_DETAILS = process.env['API_DELETE_CLIENT_DETAILS'];
export const ADD_OR_UPDATE_CLIENT = process.env['API_ADD_OR_UPDATE_CLIENT'];
export const API_UPDATE_CLIENT_DETAILS = process.env['API_UPDATE_CLIENT_DETAILS'];
export const API_GET_COUNTRIES = process.env['API_GET_COUNTRIES'];
export const API_GET_STATES = process.env['API_GET_STATES'];
export const API_GET_CITIES = process.env['API_GET_CITIES'];
export const CHAT_ANIMATION_MS = process.env['CHAT_ANIMATION_MS'];
export const API_GET_CONVERSATION_SUMMARY = process.env['API_GET_CONVERSATION_SUMMARY'];
export const API_GET_PARTICULAR_CONVERSATION = process.env['API_GET_PARTICULAR_CONVERSATION'];
export const AVATAR_ANIMATION = process.env['AVATAR_ANIMATION'];
export const GET_CLIENT_DETAILS = process.env['API_GET_CLIENT_DETAILS'];

export const API_UPLOAD_DOCUMENT_MS = process.env['API_UPLOAD_DOCUMENT_MS'];
export const APP_VERSION_API = process.env['APP_VERSION_API'];
export const CONTEXT_BASE_API = process.env['CONTEXT_BASE'];
export const API_GET_PAYMENT_PLAN = process.env['API_GET_PAYMENT_PLAN'];
export const API_INVOKE_PAYMENT = process.env['API_INVOKE_PAYMENT'];
export const API_PAYMENT_STATUS = process.env['API_PAYMENT_STATUS'];
export const API_GET_INVOICE = process.env['API_GET_INVOICE'];
export const API_PAYMENT_BASE = process.env['API_PAYMENT_BASE'];


export const BILLING_API = {
	USER_BALANCE: process.env['API_USER_BALANCE'],
	INVOICE_AI: process.env['API_INVOICE_AI'],
	PAYMENT_AI: process.env['API_PAYMENT_AI'],
	PRICING_AI: process.env['API_PRICING_AI'],
	BILLING_AI: process.env['API_BILLING_AI'],
	CANCEL_AI: process.env['API_CANCEL_AI'],
};

export const AWS_S3 = new S3Client({
	region: AWS_API.region ?? '',
	credentials: {
		accessKeyId: AWS_API.accessKeyId ?? '',
		secretAccessKey: AWS_API.secretAccessKey ?? '',
	},
});

export const UPLOAD_API = process.env['API_UPLOAD'];

export const HUMAN_RESOURCES = {
	HUMAN_RESOURCES_API: process.env['HUMAN_RESOURCES_API'],
	HUMAN_RESOURCES_WS: process.env['HUMAN_RESOURCES_WS'],
};

export const VIDEO_CHAT = process.env['API_VIDEO_CHAT'];

export const HR_ATS_MS = process.env['API_HR_ATS_MS'];

export const PROMPT_LIST = process.env['PROMPT_LIST'];

export const GET_CANDIDATE_LIST = process.env['API_GET_CANDIDATE_LIST'];

// LAYOUT

export const HEADER = {
	H_MOBILE: 56,
	H_MAIN_DESKTOP: 120, // 88
	H_DASHBOARD_DESKTOP: 92,
	H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
	W_BASE: 260,
	W_DASHBOARD: 280,
	W_DASHBOARD_MINI: 88,
	//
	H_DASHBOARD_ITEM: 48,
	H_DASHBOARD_ITEM_SUB: 32,
	//
	H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
	NAV_ITEM: 24,
	NAV_ITEM_HORIZONTAL: 22,
	NAV_ITEM_MINI: 22,
};
