import PropTypes from 'prop-types';
import { useState, useEffect, forwardRef } from 'react';
// @mui
import { Box, List, Link, Stack, Drawer, Button, Divider, Typography, IconButton, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
// config
import { NAV, ICON } from '../../config-global';
//
import { Logo } from '@zelibot/zeligate-ui';
import { Iconify } from '@zelibot/zeligate-ui';
import Scrollbar from '../scrollbar';
import { useRouter } from 'src/hooks/useRouter';
import RouterLink from 'src/components/router-link';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

MegaMenuMobile.propTypes = {
	data: PropTypes.array,
};

export default function MegaMenuMobile({ data }) {
	const { pathname } = useRouter();

	const [openDrawer, setOpenDrawer] = useState(false);

	useEffect(() => {
		if (openDrawer) {
			handleCloseDrawer();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleOpenDrawer = () => {
		setOpenDrawer(true);
	};

	const handleCloseDrawer = () => {
		setOpenDrawer(false);
	};

	return (
		<>
			<Button variant='contained' onClick={handleOpenDrawer} startIcon={<Iconify icon='eva:menu-2-fill' />}>
				Menu Mobile
			</Button>

			<Drawer open={openDrawer} onClose={handleCloseDrawer} ModalProps={{ keepMounted: true }} PaperProps={{ sx: { pb: 5, width: NAV.W_BASE } }}>
				<Scrollbar>
					<Logo sx={{ mx: 2.5, my: 3 }} />

					<Typography variant='h6' sx={{ px: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
						<Iconify icon='eva:list-fill' sx={{ mr: 1 }} /> Categories
					</Typography>

					{data.map((parent) => (
						<SubMenu key={parent.title} parent={parent} pathname={pathname} />
					))}
				</Scrollbar>
			</Drawer>
		</>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

const ParentItem = forwardRef(({ icon, title, hasSub, ...other }, ref) => (
	<ListItemButton ref={ref} sx={{ height: 44, textTransform: 'capitalize' }} {...other}>
		<ListItemIcon sx={{ width: 22, height: 22 }}>{icon}</ListItemIcon>
		<ListItemText primaryTypographyProps={{ typography: 'body2' }}>{title}</ListItemText>
		{hasSub && <Iconify icon='eva:arrow-ios-forward-fill' />}
	</ListItemButton>
));

ParentItem.propTypes = {
	hasSub: PropTypes.bool,
	icon: PropTypes.node,
	title: PropTypes.string,
};

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

SubMenu.propTypes = {
	parent: PropTypes.shape({
		title: PropTypes.string,
		icon: PropTypes.node,
		path: PropTypes.string,
		children: PropTypes.array,
	}),
	pathname: PropTypes.string,
};

function SubMenu({ parent, pathname }) {
	const { title, icon, path, children } = parent;

	const [openDrawer, setOpenDrawer] = useState(false);

	useEffect(() => {
		if (openDrawer) {
			handleCloseDrawer();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleOpenDrawer = () => {
		setOpenDrawer(true);
	};

	const handleCloseDrawer = () => {
		setOpenDrawer(false);
	};

	if (children) {
		return (
			<>
				<ParentItem title={title} icon={icon} onClick={handleOpenDrawer} hasSub />

				<Drawer
					open={openDrawer}
					onClose={handleCloseDrawer}
					BackdropProps={{ invisible: true }}
					ModalProps={{ keepMounted: true }}
					PaperProps={{
						sx: {
							width: NAV.W_DASHBOARD - 12,
							borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
						},
					}}
				>
					<Stack direction='row' alignItems='center' px={1} py={1.5}>
						<IconButton onClick={handleCloseDrawer}>
							<Iconify icon='eva:arrow-ios-back-fill' />
						</IconButton>

						<Typography noWrap variant='subtitle1' sx={{ ml: 1, textTransform: 'capitalize' }}>
							{title}
						</Typography>
					</Stack>
					<Divider />

					<Scrollbar>
						<Stack spacing={5} py={3}>
							{children.map((list) => {
								const { subheader, items } = list;

								return (
									<List key={subheader} disablePadding>
										<Typography component='div' variant='overline' sx={{ px: 2.5, mb: 1, color: 'text.secondary' }} noWrap>
											{subheader}
										</Typography>
										{items.map((link) => (
											<Link key={link.title} component={RouterLink} href={link.path} color='inherit' underline='none'>
												<ListItemButton sx={{ px: 1.5 }}>
													<ListItemIcon
														sx={{
															mr: 0.5,
															width: ICON.NAV_ITEM,
															height: ICON.NAV_ITEM,
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
														}}
													>
														<Box
															sx={{
																width: 4,
																height: 4,
																bgcolor: 'currentColor',
																borderRadius: '50%',
															}}
														/>
													</ListItemIcon>

													<ListItemText primary={link.title} primaryTypographyProps={{ noWrap: true, typography: 'body2' }} />
												</ListItemButton>
											</Link>
										))}
									</List>
								);
							})}
						</Stack>
					</Scrollbar>
				</Drawer>
			</>
		);
	}

	return (
		<Link component={NextLink} href={path} color='inherit' underline='none'>
			<ParentItem title={title} icon={icon} />
		</Link>
	);
}
