import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { Collapse, Stack, Button } from '@mui/material';
// hooks
import useActiveLink from '../../../hooks/useActiveLink';
//
import NavItem from './NavItem';
import { useRouter } from 'src/hooks/useRouter';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { useDispatch } from 'react-redux';
import { refreshComponent } from '../../../redux/slices/refresh';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavList.propTypes = {
	data: PropTypes.object,
	depth: PropTypes.number,
	hasChild: PropTypes.bool,
	// TODO: props passed down a long chain, turn into a context provider or something
	actionHandler: PropTypes.func,
	onCloseNav: PropTypes.func,
};

export default function NavList({ data, depth, hasChild, actionHandler, onCloseNav }) {
	const { pathname, push } = useRouter();

	const active = useActiveLink(data.path || '', hasChild);
	const dispatch = useDispatch();
	const externalLink = data.path && data.path.includes('http');

	const [open, setOpen] = useState(active);
	const [workspaceState, setWorkspaceState] = useState(true);

	useEffect(() => {
		if (!active) {
			handleClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleToggle = () => {
		// console.log('Data is ', data, open)
		if (data.title !== 'HR helper') {
			setOpen(!open);
		}
		if (data.id === 'recruitment') {
			setWorkspaceState(!workspaceState);
		}
		return
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleRefreshChat = () => {
		dispatch(refreshComponent({ component: 'NEW_CONVERSATION' }))
		return
	}


	if (data.id === 'new-conversation') {
		return <Stack py={1} borderRadius={1} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap={1} my={1} variant="outlined">
			<Button onClick={() => handleRefreshChat()} sx={{ border: '1px solid #3B0099', width: '90%', fontWeight: '600', fontSize: '14px', height: '40px' }}>
				<ChatOutlinedIcon sx={{ width: '20px', marginRight: '8px' }} />
				Start a new chat
			</Button>
		</Stack>
	}

	if (data.id === 'billing') {
		return <Stack py={1} borderRadius={1} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap={1} my={1} variant="outlined">
			<Button color='primary' variant='contained' onClick={() => push(data.path)} sx={{ border: '1px solid #3B0099', width: '90%', fontWeight: '600', fontSize: '14px', height: '40px' }} endIcon={<ShoppingBasketOutlinedIcon/>}>
				{data.title}
			</Button>
		</Stack>
	}

	return (
		<>
			<NavItem item={data} depth={depth} open={data.id === 'recruitment' ? workspaceState : open} active={active} isExternalLink={externalLink} onClick={handleToggle} actionHandler={actionHandler} onCloseNav={onCloseNav} />

			{hasChild && (
				<Collapse
					in={data.id === 'recruitment' ? workspaceState : open}
					unmountOnExit
					sx={{
						'& .MuiBox-root:last-child .MuiListItemIcon-root::before': {
							content: 'none',
						},
					}}
				>
					<NavSubList data={data.children} depth={depth} actionHandler={actionHandler} onCloseNav={onCloseNav} />
				</Collapse>
			)}
		</>
	);
}

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavSubList.propTypes = {
	data: PropTypes.array,
	depth: PropTypes.number,
	actionHandler: PropTypes.func,
	onCloseNav: PropTypes.func,
};

function NavSubList({ data, depth, actionHandler, onCloseNav }) {
	return (
		<>
			{data.map((list) => (
				// <></>
				<NavList key={list.title + list.path} data={list} depth={depth + 1} hasChild={!!list.children} actionHandler={actionHandler} onCloseNav={onCloseNav} />
			))}
		</>
	);
}
