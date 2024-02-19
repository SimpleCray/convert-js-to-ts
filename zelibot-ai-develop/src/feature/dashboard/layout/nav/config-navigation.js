// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import SvgColor from '../../../../components/svg-color';
import { Box } from '@mui/material';

// Icons
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import MmsOutlinedIcon from '@mui/icons-material/MmsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AodOutlinedIcon from '@mui/icons-material/AodOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VideoCameraFrontRoundedIcon from '@mui/icons-material/VideoCameraFrontRounded';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const imageIcon = (name) => <img src={`/assets/icons/navbar/${name}.png`} alt={name} style={{ width: '100%', height: '100%' }} />;

const ICONS = {
	writer: icon('ic_menu_item'),
	cart: icon('ic_cart'),
	chat: icon('ic_chat'),
	mail: icon('ic_mail'),
	profile: icon('ic_user'),
	file: icon('ic_file'),
	lock: icon('ic_lock'),
	label: icon('ic_label'),
	blank: icon('ic_blank'),
	kanban: icon('ic_kanban'),
	folder: icon('ic_folder'),
	banking: icon('ic_banking'),
	booking: icon('ic_booking'),
	billing: icon('ic_invoice'),
	calendar: icon('ic_calendar'),
	disabled: icon('ic_disabled'),
	external: icon('ic_external'),
	menuItem: icon('ic_menu_item'),
	ecommerce: icon('ic_ecommerce'),
	analytics: icon('ic_analytics'),
	dashboard: icon('ic_dashboard'),
	hrManager: imageIcon('hr_manager'),
	hrWorker: icon(''),
	hrGeneralist: imageIcon('hr_generalist'),
	hrTalent: imageIcon('hr_talent'),
	hrTraining: imageIcon('hr_training'),
	hrPartner: imageIcon('hr_partner'),
};

const navConfig = [
	// GENERAL
	// ----------------------------------------------------------------------
	// All rights reserved - SEDZ PTY LTD - 2023
	// ----------------------------------------------------------------------
	//   {
	//     subheader: 'general',
	//     items: [
	//       { title: 'dashboard', path: PATH_DASHBOARD.general.overview, icon: ICONS.dashboard, disabled: false },
	//     ],
	//   },
	// APP
	// ----------------------------------------------------------------------
	// All rights reserved - SEDZ PTY LTD - 2023
	// ----------------------------------------------------------------------
	// {
	// 	subheader: 'settings',
	// 	items: [
	// 		/* BILLING
	//   {
	//     title: 'billing',
	//     path: PATH_DASHBOARD.billing.root,
	//     icon: ICONS.billing,
	//     children: [
	//       { title: 'overview', path: PATH_DASHBOARD.billing.overview },
	//       { title: 'Invoices', path: PATH_DASHBOARD.billing.invoices },
	//       { title: 'Upgrade', path: PATH_DASHBOARD.billing.upgrade },
	//     ],
	//   },*/
	// 		// PROFILE
	// 		{
	// 			title: 'Profile settings',
	// 			path: PATH_DASHBOARD.user.root,
	// 			// icon: ICONS.profile,
	// 			icon: <PersonRoundedIcon />,
	// 			disabled: false,
	// 			children: [
	// 				{ id: 'edit', title: 'Edit', path: PATH_DASHBOARD.user.account, icon: <EditOutlinedIcon />, settingsLink: true },
	// 				{ id: 'notifications', title: 'Notifications', path: PATH_DASHBOARD.user.notifications, icon: <NotificationsOutlinedIcon />, settingsLink: true },
	// 				{ id: 'social', title: 'Social links', path: PATH_DASHBOARD.user.socialLinks, icon: <ShareOutlinedIcon />, settingsLink: true },
	// 				{ id: 'password', title: 'Change password', path: PATH_DASHBOARD.user.changePassword, icon: <LockOpenOutlinedIcon />, settingsLink: true },
	// 				{ id: 'zeli', title: 'Zeli', path: PATH_DASHBOARD.user.changeAssistant, icon: <PersonOutlineRoundedIcon />, settingsLink: true },
	// 			],
	// 		},
	// 	],
	// },

	// MANAGEMENT
	// ----------------------------------------------------------------------
	// All rights reserved - SEDZ PTY LTD - 2023
	// ----------------------------------------------------------------------
	{
		subheader: 'apps',
		items: [
			{
				title: 'HR helper',
				path: PATH_DASHBOARD.hrHelper.root,
				// icon: ICONS.profile,
				icon: <Box component='img' src='/logo/logo_single.svg' sx={{ width: 24, height: 24, cursor: 'initial' }} />,
				children: [
					// { id: 'workspace', title: 'Workspace', path: PATH_DASHBOARD.hrHelper.workspace, icon: <WorkspacesOutlinedIcon />, root: true },
					{ id: 'new-conversation', title: 'new-conversation' },
					{ id: 'recruitment', title: 'Workspace', path: PATH_DASHBOARD.hrHelper.openJobs, icon: <WorkspacesOutlinedIcon />, action: 'FIRST_TIME_ATS' },
					{ id: 'jobs', title: 'Jobs', path: PATH_DASHBOARD.hrHelper.openJobs, icon: <WorkOutlineRoundedIcon />, action: 'JOB_OPENING_LIST' },
					{ id: 'candidates', title: 'Candidates', path: PATH_DASHBOARD.hrHelper.candidates, icon: <PersonOutlineRoundedIcon />, action: 'DISPLAY_CANDIDATE_LISTING' },
					{ id: 'clients', title: 'Clients/Departments', path: PATH_DASHBOARD.hrHelper.candidates, icon: <GroupsOutlinedIcon />, action: 'CLIENT_LIST' }, // path is nonsense but path are no more
					// { title: 'Job Profiles', path: PATH_DASHBOARD.hrHelper.jobProfiles },
					// { id: 'ads', title: 'Job ads', path: PATH_DASHBOARD.hrHelper.jobAds, icon: <MmsOutlinedIcon />, action: 'JOB_AD_LIST' },
					{ id: 'documents', title: 'Documents', path: PATH_DASHBOARD.hrHelper.uploadDocuments, icon: <DescriptionOutlinedIcon />, action: 'USER_DOCUMENTS' },
					// { id: 'emails', title: 'Emails', path: PATH_DASHBOARD.hrHelper.sendEmail, icon: <EmailOutlinedIcon /> },
					// { id: 'sms', title: 'SMS', path: PATH_DASHBOARD.hrHelper.sendSMS, icon: <AodOutlinedIcon /> },
					// { id: 'phone', title: 'Phone calls', path: PATH_DASHBOARD.hrHelper.phoneCandidate, icon: <PhoneOutlinedIcon /> },
					// { id: 'video', title: 'Video calls', path: PATH_DASHBOARD.hrHelper.videoMessaging, icon: <VideoCameraFrontRoundedIcon /> },
					// { id: 'history', title: 'History', path: PATH_DASHBOARD.hrHelper.history, icon: <HistoryEduOutlinedIcon />, root: true },
					{ id: 'conversation_summary', title: 'History', path: '', icon: <HistoryEduIcon />, action: 'CONVERSATION_SUMMARY' },
					// { id: 'reports', title: 'Reports', path: PATH_DASHBOARD.hrHelper.reports, icon: <AssessmentOutlinedIcon />, action: 'CANDIDATES_QUICKSIGHT',
						// children: [
						// 	{
						// 		id: 'candidates_report',
						// 		title: 'Candidates',
						// 		icon: <PersonOutlineRoundedIcon />,
						// 		path: undefined,
						// 		action: 'CANDIDATES_QUICKSIGHT',
						// 	},
						// ]
					// },
				],
			},
			// INTERNAL AFFAIRS
			// {
			// 	title: 'Internal Affairs',
			// 	path: PATH_DASHBOARD.internalAffairs.root,
			// 	icon: ICONS.profile,
			// 	disabled: false,
			// 	children: [
			// 		{ title: 'Edit Actions', path: PATH_DASHBOARD.internalAffairs.editActions },
			// 	],
			// },

			/*
				return e.prompts.map((p) => {
				return {
					title: p.title,
					path: undefined,
					icon: <PromptIconType variant={p.icon} />,
					action: p.action[0], // fingers crossed that they're consistently single item arrays
				};
			})
			*/
		],
	},
];

export default navConfig;
