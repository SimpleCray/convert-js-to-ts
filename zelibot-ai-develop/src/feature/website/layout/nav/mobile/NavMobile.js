import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { List, Drawer, IconButton, Stack } from '@mui/material';
// config
import { NAV } from '../../../../../config-global';
// components
import { Logo } from '@zelibot/zeligate-ui';
import { Iconify } from '@zelibot/zeligate-ui';
import Scrollbar from '../../../../../components/scrollbar';
//
import NavList from './NavList';
import { usePathname } from 'src/hooks/usePathname';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavMobile.propTypes = {
	data: PropTypes.array,
	isOffset: PropTypes.bool,
};

function NavMobile ({ isOffset, data, style }) {
	const pathname = usePathname();

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) {
			handleClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<IconButton
				onClick={handleOpen}
				sx={{
					ml: 1.5,
					mr: 1.5,
					color: style === 'dark' ? 'text.primary' : '#fff',
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.1)',
					},
				}}
			>
				<Iconify icon='eva:menu-2-fill' />
			</IconButton>
			<Drawer
				sx={{
					"& .MuiPaper-root": {
						backgroundColor: 'rgba(0, 0, 0, 0.1)'
					}
				}}
				open={open}
				onClose={handleClose}
				anchor='right'
				PaperProps={{
					sx: {
						pb: 5,
						// width: NAV.W_BASE,
						width: '100%'
					},
				}}
			>
				{/* <Scrollbar> */}
				{/* <Logo sx={{ mx: 2.5, my: 3 }} /> */}
				{/* <List component='nav' disablePadding>
						{data.map((link) => (
							<NavList key={link.title} item={link} />
						))}
					</List> */}
				{/* </Scrollbar> */}
				<Stack sx={{height: '100%', width: '100%'}} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
					<List component='nav' disablePadding>
						{data.map((link) => (
							<NavList key={link.title} item={link} />
						))}
					</List>
				</Stack>
			</Drawer>
		</>
	);
}

export default NavMobile;