import PropTypes from 'prop-types';
// @mui
import { Stack, AppBar, Toolbar, Fab, Box, Button, Badge } from '@mui/material';
// utils
import { bgBlur } from '../../../../utils/cssStyles';
// config
import { HEADER } from '../../../../config-global';
// components
import { Logo } from '@zelibot/zeligate-ui';
import AccountPopover from '../../../dashboard/layout/header/AccountPopover';
import LanguagePopover from '../../../dashboard/layout/header/LanguagePopover';
import NotificationsPopover from '../../../dashboard/layout/header/NotificationsPopover';
import { useTheme } from '@mui/material/styles';
import useResponsive from '../../../../hooks/useResponsive';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import QuestionMarkRounded from '@mui/icons-material/QuestionMarkRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Iconify } from '@zelibot/zeligate-ui';
import { IconButtonAnimate } from '../../../../components/animate';
import { getCurrentCredits } from '../../../../constants';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

Header.propTypes = {
	onOpenNav: PropTypes.func,
	onCloseNav: PropTypes.func,
	openNav: PropTypes.bool,
	handleNotificationAction: PropTypes.func,
	handleSettingsClick: PropTypes.func,
	outputCardAction: PropTypes.func,
};

export default function Header({ showEducationModal, openNav, onOpenNav, onCloseNav, handleNotificationAction, handleSettingsClick, outputCardAction, hideNavBar = false }) {
	const theme = useTheme();
	const isDesktop = useResponsive('up', 'md');

	const [subscriptionStatus, setSubscriptionStatus] = useState(false);

	useEffect(() => {
		handleGetCurrentCredits();
	}, []);

	const handleGetCurrentCredits = async () => {
		await getCurrentCredits('SUBSCRIPTION')
			.then((response) => {
				setSubscriptionStatus(response?.data?.subscription_status);
			})
			.catch((error) => {
				console.error('error: ', error);
			});
	};

	const handleSendNotificationAction = (data) => {
		handleNotificationAction(data);
	};

	const renderContent = (
		<Stack direction='row' flexGrow={1} alignItems='center'>
			<Box sx={{ display: 'flex', flexGrow: 1 }} alignItems='center'>
				{/* {!hideNavBar && <Fab onClick={openNav ? onCloseNav : onOpenNav} size='small' color={'gradient'} sx={{ display: 'inline-flex' }}>
					{openNav ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
				</Fab>} */}
				{isDesktop && <Logo onClick={openNav ? onCloseNav : onOpenNav} type={'full'} sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-start', cursor: 'pointer' }} />}
			</Box>

			{/* Only show Zeligate logo in header on desktop: */}
			<Stack flexGrow={1} direction='row' alignItems='center' justifyContent='flex-end' spacing={{ xs: 0.5, sm: 1.5 }}>
				{subscriptionStatus === 'active' ? (
					<Button variant='contained' color='primary' size='small' onClick={() => outputCardAction(undefined, 'SETTINGS', 'billing')}>
						More credits
					</Button>
				) : (
					<Button variant='contained' color='primary' size='small' onClick={() => outputCardAction(undefined, 'SETTINGS', 'billing')}>
						Subscribe now
					</Button>
				)}

				{showEducationModal && (
					<IconButtonAnimate
						onClick={() => {
							// console.log('Clicking on show education modal!')
							showEducationModal();
						}}
						sx={{ width: 40, height: 40 }}
					>
						<Iconify icon='eva:question-mark-circle-outline' />
					</IconButtonAnimate>
				)}

				{/*<LanguagePopover />*/}

				<NotificationsPopover handleNotificationAction={handleSendNotificationAction} />

				<AccountPopover outputCardAction={outputCardAction} />
			</Stack>
		</Stack>
	);

	return (
		<AppBar
			sx={{
				boxShadow: 'none',
				height: HEADER.H_MOBILE,
				zIndex: theme.zIndex.appBar + 1,
				...bgBlur({
					color: theme.palette.background.default,
				}),
				transition: theme.transitions.create(['height'], {
					duration: theme.transitions.duration.shorter,
				}),
				// backgroundColor: 'red'
			}}
		>
			<Toolbar
				sx={{
					height: 1,
					px: '16px !important',
					...(isDesktop && {
						px: '24px !important',
					}),
				}}
			>
				{renderContent}
			</Toolbar>
		</AppBar>
	);
}
