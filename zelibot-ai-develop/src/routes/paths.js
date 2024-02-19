// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

function path(root, subLink) {
	return `${root}${subLink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

export const PATH_AUTH = {
	root: ROOTS_AUTH,
	login: path(ROOTS_AUTH, '/login'),
	register: path(ROOTS_AUTH, '/register'),
	verify: path(ROOTS_AUTH, '/verify'),
	resetPassword: path(ROOTS_AUTH, '/reset-password'),
	newPassword: path(ROOTS_AUTH, '/new-password'),
	onboarding: path(ROOTS_AUTH, '/onboarding'),
};

export const PATH_PAGE = {
	features: '/features',
	product: '/product',
	pricing: '/pricing',
	about: '/about',
	company: '/company',
	faqs: '/faqs',
	terms: '/terms',
	privacy: '/privacy',
	integration: '/integration',
};

export const PATH_DASHBOARD = {
	root: ROOTS_DASHBOARD,
	general: {
		overview: path(ROOTS_DASHBOARD, '/overview'),
	},
	hrHelper: {
		root: path(ROOTS_DASHBOARD, '/hr-helper'),
		workspace: path(ROOTS_DASHBOARD, '/hr-helper/workspace'),
		openJobs: path(ROOTS_DASHBOARD, '/hr-helper/open-jobs'),
		candidates: path(ROOTS_DASHBOARD, '/hr-helper/candidates'),
		jobProfiles: path(ROOTS_DASHBOARD, '/hr-helper/job-profiles'),
		jobAds: path(ROOTS_DASHBOARD, '/hr-helper/job-ads'),
		uploadDocuments: path(ROOTS_DASHBOARD, '/hr-helper/upload-documents'),
		sendEmail: path(ROOTS_DASHBOARD, '/hr-helper/send-email'),
		sendSMS: path(ROOTS_DASHBOARD, '/hr-helper/send-sms'),
		phoneCandidate: path(ROOTS_DASHBOARD, '/hr-helper/phone-candidate'),
		history: path(ROOTS_DASHBOARD, '/hr-helper/history'),
		videoMessaging: path(ROOTS_DASHBOARD, '/hr-helper/video-messaging'),
	},
	user: {
		root: path(ROOTS_DASHBOARD, '/user'),
		new: path(ROOTS_DASHBOARD, '/user/new'),
		account: path(ROOTS_DASHBOARD, '/user/account'),
		notifications: path(ROOTS_DASHBOARD, '/user/notifications'),
		socialLinks: path(ROOTS_DASHBOARD, '/user/social-links'),
		changePassword: path(ROOTS_DASHBOARD, '/user/change-password'),
		changeAssistant: path(ROOTS_DASHBOARD, '/user/assistant'),
		edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
		demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
	},
	billing: {
		root: path(ROOTS_DASHBOARD, '/billing'),
		overview: path(ROOTS_DASHBOARD, '/billing/overview'),
		invoices: path(ROOTS_DASHBOARD, '/billing/invoices'),
		upgrade: path(ROOTS_DASHBOARD, '/billing/upgrade'),
		view: (id) => path(ROOTS_DASHBOARD, `/billing/invoices/${id}`),
	},
	internalAffairs: {
		root: path(ROOTS_DASHBOARD, '/internal-affairs'),
		editActions: path(ROOTS_DASHBOARD, '/internal-affairs/edit-actions'),
	},
};
