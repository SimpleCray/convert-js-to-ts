import { Iconify } from '@zelibot/zeligate-ui';
import { PATH_DASHBOARD as DASHBOARD_PATHS } from '../../../../../routes/paths';
import AccountGeneral from './AccountGeneral';
import AccountNotifications from './AccountNotifications';
import AccountChangePassword from './AccountChangePassword';
import AccountSocialLinks from './AccountSocialLinks';
import AccountChangeAssistant from './AccountChangeAssistant';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AccountBilling from './AccountBilling';

export const USER_TABS = [
	{
		value: 'general',
		label: 'General',
		icon: <Iconify icon='ic:outline-manage-accounts' />,
		link: DASHBOARD_PATHS.user.account,
		component: AccountGeneral,
	},
	{
		value: 'notifications',
		label: 'Notifications',
		icon: <Iconify icon='ic:outline-notifications' />,
		link: DASHBOARD_PATHS.user.notifications,
		component: AccountNotifications,
	},
	{
		value: 'social_links',
		label: 'Social links',
		icon: <Iconify icon='ic:round-share' />,
		link: DASHBOARD_PATHS.user.socialLinks,
		component: AccountSocialLinks,
	},
	{
		value: 'change_password',
		label: 'Password',
		icon: <Iconify icon='ic:round-key' />,
		link: DASHBOARD_PATHS.user.changePassword,
		component: AccountChangePassword,
	},
	{
		value: 'change_assistant',
		label: 'Zeli',
		icon: <Iconify icon='ic:outline-account-circle' />,
		link: DASHBOARD_PATHS.user.changeAssistant,
		component: AccountChangeAssistant,
	},
	{
		value: 'billing',
		label: 'Billing',
		icon: <ReceiptOutlinedIcon />,
		link: DASHBOARD_PATHS.billing.upgrade,
		component: AccountBilling,
	},
]; 
