import { useEffect, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/context/useAuthContext';
// components
import { CustomAvatar } from '../../../../components/custom-avatar';
import { useSnackbar } from 'notistack';
import MenuPopover from '../../../../components/menu-popover';
import { IconButtonAnimate } from '../../../../components/animate';
import { useRouter } from 'src/hooks/useRouter';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const OPTIONS = [
	/*
{
  label: 'Profile',
  linkTo: PATH_DASHBOARD.user.account,
},
{
  label: 'Billing',
  linkTo: PATH_DASHBOARD.billing.overview,
},
*/
];

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export default function AccountPopover({ outputCardAction }) {
	const { replace, push, asPath } = useRouter();
	const { user, logout } = useAuthContext();
	const { enqueueSnackbar } = useSnackbar();
	const [openPopover, setOpenPopover] = useState(null);

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleLogout = async () => {
		try {
			logout();
			void replace(PATH_AUTH.login);
			handleClosePopover();
		} catch (error) {
			console.error(error);
			enqueueSnackbar('Unable to logout!', { variant: 'error' });
		}
	};

	const handleClickItem = (path) => {
		handleClosePopover();
		void push(path);
	};

	// loop through PATH_PAGE object and add to array
	let pathPage = false;
	if (asPath === '/' || asPath === PATH_PAGE.terms || asPath === PATH_PAGE.privacy) {
		pathPage = true;
	}
	// Get first string of email
	const defaultUserAvatar = !user?.displayName || user?.displayName?.toLowerCase() === 'go to profile' ? user?.email?.split('@')[0] : user?.displayName;

	return (
		<>
			<IconButtonAnimate
				onClick={handleOpenPopover}
				sx={{
					p: 0,
					...(openPopover && {
						'&:before': {
							zIndex: 1,
							content: "''",
							width: '100%',
							height: '100%',
							borderRadius: '50%',
							position: 'absolute',
							bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
						},
					}),
				}}
			>
				<CustomAvatar src={user?.photoURL} alt={defaultUserAvatar} name={defaultUserAvatar} />
			</IconButtonAnimate>

			<MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 300, p: 0, overflow: 'hidden' }} disabledArrow>
				<Box sx={{ py: 1.5, px: 2.5, backgroundColor: '#E3C7F9' }}>
					{user?.displayName?.toLowerCase() === 'go to profile' || user?.displayName === undefined ? null : (
						<Typography sx={{ color: '#21054C', fontWeight: '600' }} noWrap>
							{user?.displayName}
						</Typography>
					)}
					<Typography sx={{ color: '#21054C' }} noWrap>
						{user?.email}
					</Typography>
				</Box>

				<Divider />

				<MenuItem onClick={() => outputCardAction(undefined, 'SETTINGS', null)} sx={{ m: 1 }}>
					<ManageAccountsOutlinedIcon />
					Settings
				</MenuItem>
				<MenuItem onClick={() => outputCardAction(undefined, 'SETTINGS', 'notifications')} sx={{ m: 1 }}>
					<NotificationsNoneOutlinedIcon />
					Notifications
				</MenuItem>
				<MenuItem onClick={() => outputCardAction(undefined, 'SETTINGS', 'social_links')} sx={{ m: 1 }}>
					<ShareOutlinedIcon />
					Social links
				</MenuItem>
				<MenuItem onClick={() => outputCardAction(undefined, 'SETTINGS', 'change_password')} sx={{ m: 1 }}>
					<KeyRoundedIcon />
					Change password
				</MenuItem>
				<MenuItem onClick={() => outputCardAction(undefined, 'SETTINGS', 'change_assistant')} sx={{ m: 1 }}>
					<AccountCircleOutlinedIcon />
					Change Zeli
				</MenuItem>
				<MenuItem onClick={() => outputCardAction(undefined, 'SETTINGS', 'billing')} sx={{ m: 1 }}>
					<ReceiptOutlinedIcon />
					Billing
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleLogout} sx={{ m: 1 }}>
					<LogoutOutlinedIcon />
					Logout
				</MenuItem>
			</MenuPopover>
		</>
	);
}
