import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, List, Badge, Avatar, Tooltip, IconButton, Typography, ListItemText, ListItemAvatar, ListItemButton, Button } from '@mui/material';
// utils
import { convertUTCToLocalDate, fToNow } from '../../../../utils/formatTime';
// components
import { Iconify } from '@zelibot/zeligate-ui';
import Scrollbar from '../../../../components/scrollbar';
import MenuPopover from '../../../../components/menu-popover';
import { IconButtonAnimate } from '../../../../components/animate';
import SvgColor from '../../../../components/svg-color';
import { useDispatch, useSelector } from '../../../../redux/store';
import { updateNotification, createNotification, unreadNotficationsSelector, notificationsSelector, clearNotifications } from '../../../../redux/slices/notification';
import { getNotifications } from '../../../../redux/slices/notification';
import { NOTIFICATIONS_TIMEOUT } from '../../../../config-global';
import { markNotificationAsRead } from '../../../../constants';
import { useRouter } from 'src/hooks/useRouter';
import { Loading } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

// get redux state from store and map to props

const StyledBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		backgroundColor: theme.palette.primary.light, 
	},
}));

export default function NotificationsPopover({ handleNotificationAction }) {
	const dispatch = useDispatch();
	const popoverRef = useRef(null);

	const notifications = useSelector(notificationsSelector);
	const unreadNotifications = useSelector(unreadNotficationsSelector);
	const [notificationsArray, setNotificationsArray] = useState([]);
	const [prevNotificationsLength, setPrevNotificationsLength] = useState(0);
	const [openPopover, setOpenPopover] = useState(null);
	const [waiting, setWaiting] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			dispatch(getNotifications());
		}, NOTIFICATIONS_TIMEOUT * 1000);
		return () => clearInterval(interval);
	}, [prevNotificationsLength]);

	useEffect(() => {
		if (unreadNotifications.length !== prevNotificationsLength) {
			if (waiting) {
				setWaiting(false);
			}
			setNotificationsArray(unreadNotifications);
			setPrevNotificationsLength(unreadNotifications.length);

			// Don't show until user clicks to open
			// if (unreadNotifications.length > prevNotificationsLength) {
			// 	setOpenPopover(popoverRef.current);
			// }
		}
	}, [notifications]);

	const totalUnRead = unreadNotifications.length || 0;

	const handleOpenPopover = (event) => {
		setOpenPopover(event.currentTarget);
	};

	const handleClosePopover = () => {
		setOpenPopover(null);
	};

	const handleMarkAllAsRead = async () => {
		setWaiting(true);
		const notificationsToMarkAsRead = [];
		notificationsArray.forEach((notification) => {
			if (notification.SubCategory === 'UNREAD') {
				dispatch(updateNotification({ ...notification, SubCategory: 'READ' }));
			}	
			notificationsToMarkAsRead.push({
				sk: notification.messageId,
				status: 'READ',
			});
		});
		const markNotificationAsReadPayload = {
			read_notification: notificationsToMarkAsRead,
		};
		const jsonStringPayload = JSON.stringify(markNotificationAsReadPayload);
		const res = await markNotificationAsRead(`${jsonStringPayload}`);
		// might need this back, for now dispatching to clear redux and hoping
		// if (res !== "success") {
			// setWaiting(false);
		// }
		dispatch(clearNotifications());
		setOpenPopover(null);
	};

	return (
		<>
			<IconButtonAnimate color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover} ref={popoverRef} sx={{ width: 40, height: 40 }}>
				{/* <Badge badgeContent={totalUnRead} sx={{ background: (theme) => theme.palette.primary.light }}> */}
				<StyledBadge badgeContent={totalUnRead} color='error'>
					<Iconify icon='eva:bell-fill' />
				</StyledBadge>
			</IconButtonAnimate>

			<MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }} disabledArrow>
				<Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant='subtitle1'>Notifications</Typography>

						<Typography variant='body2' sx={{ color: 'text.secondary' }}>
							You have {totalUnRead} unread messages
						</Typography>
					</Box>

					{totalUnRead > 0 && (
						<>
							{waiting && (
								<Loading />
							)}
							{!waiting && (
								<Tooltip title=' Mark all as read'>
									<IconButton color='primary' onClick={handleMarkAllAsRead} disabled={waiting}>
										<Iconify icon='eva:done-all-fill' />
									</IconButton>
								</Tooltip>
							)}
						</>
					)}
				</Box>

				<Scrollbar sx={{ height: { xs: 340, sm: 'auto' }, maxHeight: 380 }}>
					<List disablePadding>
						{notificationsArray?.map((notification) => (
							<NotificationItem key={notification.messageId} notification={notification} handleNotificationAction={handleNotificationAction} setOpenPopover={setOpenPopover} />
						))}
					</List>
				</Scrollbar>
			</MenuPopover>
		</>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NotificationItem.propTypes = {
	notification: PropTypes.shape({
		messageId: PropTypes.string,
		avatar: PropTypes.node,
		type: PropTypes.string,
		title: PropTypes.string,
		status: PropTypes.string,
		message: PropTypes.string,
		action: PropTypes.string,
	}),
	handleNotificationAction: PropTypes.func,
	setOpenPopover: PropTypes.func,
	handleSendNotificationAction: PropTypes.func,
};

function NotificationItem({ notification, handleNotificationAction, setOpenPopover }) {
	const dispatch = useDispatch();
	const { push } = useRouter();
	const { avatar, title } = renderContent(notification);

	const handleOnClick = () => {
		if (notification?.url) void push(notification?.url);
		dispatch(updateNotification({ ...notification, status: 'READ' }));
		handleNotificationAction(notification);
		setOpenPopover(null);
		const markNotificationAsReadPayload = {
			sk: notification.messageId,
			status: 'READ',
		};
		const jsonStringPayload = JSON.stringify(markNotificationAsReadPayload);
		void markNotificationAsRead(`${jsonStringPayload}`);
	};

	return (
		<ListItemButton
			sx={{
				py: 1.5,
				px: 2.5,
				mt: '1px',
				...(notification.status === 'UNREAD' && {
					bgcolor: 'action.selected',
				}),
			}}
			onClick={handleOnClick}
		>
			<ListItemAvatar>
				<Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
			</ListItemAvatar>

			<ListItemText
				disableTypography
				primary={title}
				secondary={
					<Stack direction='row' sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
						<Iconify icon='eva:clock-fill' width={16} sx={{ mr: 0.5 }} />
						<Typography variant='caption'>{fToNow(convertUTCToLocalDate(notification.dateSent))}</Typography>
					</Stack>
				}
			/>
		</ListItemButton>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

function renderContent(notification) {
	const title = (
		<Typography variant='subtitle2'>
			{notification.title}
			<Typography component='div' variant='body2' sx={{ color: 'text.secondary' }}>
				{notification.message}
			</Typography>
		</Typography>
	);

	if (notification.type === 'INFORMATION') {
		return {
			avatar: icon('ic_cart'),
			title,
		};
	}
	if (notification.type === 'BILLING') {
		return {
			avatar: icon('ic_invoice'),
			title,
		};
	}
	return {
		avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
		title,
	};
}
