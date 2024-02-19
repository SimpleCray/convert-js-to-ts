import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Box, Stack, Drawer, Fab } from '@mui/material';
// config
import { NAV } from '../../../../config-global';
// components
import { Logo } from '@zelibot/zeligate-ui';
import Scrollbar from '../../../../components/scrollbar';
import { NavSectionVertical } from '../../../../components/nav-section';
import Typography from '@mui/material/Typography';

import navConfig from '../../../dashboard/layout/nav/config-navigation';
import { useRouter } from 'src/hooks/useRouter';
import { APP_VERSION } from '../../../../config-global'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { keyframes } from '@emotion/react';
import Tooltip from '@mui/material/Tooltip';
import { useAuthContext } from '../../../auth/context/useAuthContext';


// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavVertical.propTypes = {
	openNav: PropTypes.bool,
	onOpenNav: PropTypes.func,
	onCloseNav: PropTypes.func,
	actionHandler: PropTypes.func,
	isDesktop: PropTypes.bool,
	extraConfig: PropTypes.array,
};

export default function NavVertical({ openNav, onOpenNav, onCloseNav, actionHandler, isDesktop, extraConfig = [] }) {
	const { pathname } = useRouter();
	const { user } = useAuthContext();

	const [expandMenu, setExpandMenu] = useState(true);
	const [ongoingAnimation, setOngoingAnimation] = useState(false);
	const [closingExpandMenu, setClosingExpandMenu] = useState(false);

	const handleMouseOver = (e) => {
		if (e.target.id === 'expand-nav-btn') {
			// console.log('e.targer.id is expand btn')
			return
		}
		// console.log('Hovering!', openNav)
		if (!openNav && !closingExpandMenu) {
			return onOpenNav();
		}
	}

	const handleMouseLeave = () => {
		// console.log('HANDLING MOUSE LEAVE')
		if (openNav && !expandMenu) {
			return onCloseNav();
		}
	}

	const handleTransitionEnd = () => {
		if (!openNav) {
			setExpandMenu(false);
			setClosingExpandMenu(false);
		}
	}

	const rippleAnimation = keyframes`
	0% {
		border: 2px solid #E3C7F9;
	}
	50% {
		border: 4px solid #E3C7F9;
	}
	100% {
		border: 2px solid #E3C7F9;
	}
`;

	const manipulateExtraConfig = (navConfig, extra) => {
		// assumption here is that the extra config stuff is ATS prompts
		// should only exist when used in workspace domain
		if (!extra || !extra.length) {
			return navConfig;
		}

		// flat list of all ATS actions
		const prompts = extra.map(
			(e) => e.prompts.map(
				(p) => ({
					title: p.title,
					path: undefined,
					// icon: <PromptIconType variant={p.icon} />,
					action: p.action[0], // fingers crossed that they're consistently single item arrays
				}),
			),
		);
		// A separate top level nav item with the prompts as children, if required (probably not likely)
		// const recruitmentTasks = {
		// 	subheader: 'Workspace',
		// 	items: [
		// 		{
		// 			title: 'Workspace',
		// 			path: undefined,
		// 			icon: <WorkspacesOutlinedIcon />,
		// 			children: prompts.flat(),
		// 		}
		// 	]
		// };

		// const combined = navConfig.concat(recruitmentTasks);
		// return combined;

		const recruitment = navConfig.find((g) => g.subheader === 'apps').items[0].children.find((c) => c.id === 'recruitment');
		recruitment.children = prompts.flat();
		return navConfig;

		// ATS actions split into the same groups as they appear in the output cards
		// Not currently required, likely never will but leaving it anyway
		// const other = extra.map((e) => {
		// 	return {
		// 		subheader: e.title,
		// 		items: [{
		// 			title: e.title,
		// 			icon: <WorkspacesOutlinedIcon />,
		// 			path: undefined,
		// 			children: e.prompts.map((p) => ({ title: p.title, path: undefined, icon: <PromptIconType variant={p.icon} />, action: p.action[0] })),
		// 		}]
		// 	}
		// });

		// return navConfig.concat(other);
	}

	const renderContent = (
		<Scrollbar
			sx={{
				height: 1,
				'& .simplebar-content': {
					height: 1,
					display: 'flex',
					flexDirection: 'column',
				},
				// backgroundColor: 'red'
			}}
		>
			{/* <Stack
				spacing={3}
				sx={{
					pt: 3,
					pb: 2,
					px: 2.5,
					flexShrink: 0,
				}}
			>
				<NavAccount />
			</Stack> */}

			<NavSectionVertical data={manipulateExtraConfig(navConfig, extraConfig)} hideHeader actionHandler={actionHandler} onCloseNav={onCloseNav} />
			<Box sx={{
				flexGrow: 1,
				// backgroundColor: 'red'
			}} />

			{/*<NavDocs />*/}
		</Scrollbar>
	);

	const handleMenuAction = () => {
		// if (openNav) {
		// 	return onCloseNav();
		// } else {
		// 	return onOpenNav();
		// }
		// console.log('Expand Menu Option ', expandMenu)
		if (expandMenu) {
			setExpandMenu(false);
			setClosingExpandMenu(true);
			return onCloseNav();
		}
		if (!expandMenu) {
			setExpandMenu(true);
			return onOpenNav();
		}
	}

	if (isDesktop) {
		return (
			// <Box
			// 	component='nav'
			// 	sx={{
			// 		flexShrink: { lg: 0 },
			// 	}}
			// >
			<Drawer
				open={openNav}
				onTransitionEnd={() => handleTransitionEnd()}
				// onClose={onCloseNav}
				// ModalProps={{
				// 	keepMounted: true,
				// }}
				PaperProps={{
					sx: {
						width: NAV.W_DASHBOARD,
						flexShrink: 0,
						boxSizing: 'border-box',
						transform: openNav ? 'translateX(0px) !important' : 'translateX(-285px) !important',
						visibility: 'visible !important',
						transition: (theme) => theme.transitions.create('transform', {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.leavingScreen,
						}),
						// '&:hover': {
						// 	transform: 'translateX(0px) !important',
						// },
						height: 'calc(100% - 70px)',
						top: '70px',
						border: 'none',
						overflow: 'visible'
					},
				}}
				variant='persistent'
				anchor="left"
				sx={{
					width: NAV.W_DASHBOARD,
					height: 'calc(100% - 70px)',
					top: '70px',
				}}
			// sx={{
			// 	width: NAV.W_DASHBOARD,
			// 	flexShrink: 0,
			// 	'& .MuiDrawer-paper': {
			// 		width: NAV.W_DASHBOARD,
			// 		boxSizing: 'border-box',
			// 	},
			// 	'& .MuiDrawer-paperAnchorDockedLeft': {
			// 		transform: openNav ? 'translateX(2px) !important' : 'translateX(-230px) !important',
			// 		visibility: 'visible !important',
			// 		transition: (theme) => theme.transitions.create('transform', {
			// 			easing: theme.transitions.easing.sharp,
			// 			duration: theme.transitions.duration.leavingScreen,
			// 		}),
			// 	},
			// }}
			>
				{/* <Box sx={{ display: 'flex', flexGrow: 1, padding: (theme) => `${theme.spacing(1.5)} ${theme.spacing(1.5)} 0 0` }} alignItems='center' justifyContent='flex-end'>
						<Fab onClick={openNav ? onCloseNav : onOpenNav} size='small' color={'gradient'}>
							{openNav ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
						</Fab>
					</Box> */}
				{/* {renderContent}
				<Typography sx={{ margin: '24px', color: '#9BA0AE', fontSize: '12px' }} >
					{APP_VERSION}
				</Typography> */}
				<Stack
					onMouseEnter={(e) => handleMouseOver(e)}
					onMouseLeave={() => handleMouseLeave()}
					sx={{ backgroundColor: 'transparent', width: '110%', height: '100%', position: 'absolute', left: 0, transform: 'translateX(0%)', pointerEvents: 'auto' }}>
					<Stack sx={{ width: '92%', height: '100%' }}>
						{renderContent}
						<Typography sx={{ margin: '24px', color: '#9BA0AE', fontSize: '12px' }} >
							{APP_VERSION} <br/>
							{user.email}
						</Typography>
					</Stack>
					<Stack id="expand-nav-btn" justifyContent={'center'} alignItems={'center'} sx={{ position: 'absolute', right: '0px', top: '48px', transform: 'translateX(50%)', width: '50px', height: '50px' }}>
						<Box sx={{ borderRadius: '50%', transition: '0.5s ease', '&:hover': { animation: `${rippleAnimation} 1s infinite` } }}>
							<Tooltip title={openNav && !expandMenu ? 'Expand' : openNav && expandMenu ? 'Close' : 'Open'} placement='right'>
								<Stack justifyContent={'center'} alignItems={'center'} onClick={() => handleMenuAction()} color={'gradient'} sx={{ borderRadius: '50%', width: '24px', height: '24px', background: 'linear-gradient(132.18deg, #B46D8F 8.44%, #370F67 40.29%, #000000 92.54%);', cursor: 'pointer', pointerEvents: 'auto' }}>
									{openNav && expandMenu ? <ChevronLeftRoundedIcon sx={{ width: '20px', color: 'white' }} /> : <ChevronRightRoundedIcon sx={{ width: '20px', color: 'white' }} />}
								</Stack>
							</Tooltip>
						</Box>
					</Stack>
				</Stack>
			</Drawer>
			// </Box>
		);

	} else {
		return (
			<Box
				component='nav'
				sx={{
					flexShrink: { lg: 0 },
				}}
			>
				<Drawer
					open={openNav}
					onClose={onCloseNav}
					ModalProps={{
						keepMounted: true,
					}}
					PaperProps={{
						sx: {
							width: NAV.W_DASHBOARD,
						},
					}}
				>
					{renderContent}
				</Drawer>
			</Box>
		);
	}
}