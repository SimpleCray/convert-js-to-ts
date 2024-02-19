import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Tooltip, Link, ListItemText } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
// auth
import RoleBasedGuard from '../../../feature/auth/context/RoleBasedGuard';
//
import { Iconify } from '@zelibot/zeligate-ui';
//
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';
import RouterLink from 'src/components/router-link';
import useResponsive from '../../../hooks/useResponsive';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

NavItem.propTypes = {
	open: PropTypes.bool,
	active: PropTypes.bool,
	item: PropTypes.object,
	depth: PropTypes.number,
	isExternalLink: PropTypes.any,
	actionHandler: PropTypes.func,
	onCloseNav: PropTypes.func,
};

export default function NavItem({ item, depth, open, active, isExternalLink, actionHandler, onCloseNav, ...other }) {
	const isDesktop = useResponsive('up', 'md');
	const { translate } = useLocales();
	const location = useLocation();

	const { id, title, path, icon, info, children, disabled, caption, roles, action, root, settingsLink } = item;

	const subItem = depth > 2;

	// history check is temporary
	const isInactive = !action && !root && !settingsLink && subItem && id !== 'history';
	const isSocketConnected = location.pathname.includes('workspace');
	const isWorkspaceSubItem = !settingsLink && !root && subItem;

	const renderContent = (
		<StyledItem depth={depth} active={active || open} disabled={disabled} caption={!!caption} {...other} sx={{ ...((isInactive || (isWorkspaceSubItem && !isSocketConnected)) && { cursor: 'default', color: 'grey' }) }}>
			{icon && <StyledIcon>{icon}</StyledIcon>}

			{subItem && !icon && (
				<StyledIcon depth={depth} sx={{
					'&::before': {
						content: '""',
						position: 'absolute',
						borderLeft: '2px solid #E3C7F9',
						height: '100%',
						width: '16px',
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						top: '50%',
						borderLeft: '2px solid #E3C7F9',
						borderBottom: '2px solid #E3C7F9',
						borderBottomLeftRadius: '16px',
						width: '16px',
						height: '22px',
						transform: 'translateY(-100%)',
					},
					'& .MuiBox-root:last-child > .MuiListItemIcon-root': {
						content: 'none',
					},
				}}>
					{/*<StyledDotIcon active={active && subItem} />*/}
				</StyledIcon>
			)}

			<ListItemText
				sx={{
					textTransform: 'none',
				}}
				primary={`${translate(title)}`}
				secondary={
					caption && (
						<Tooltip title={`${translate(caption)}`} placement='top-start'>
							<span>{`${translate(caption)}`}</span>
						</Tooltip>
					)
				}
				primaryTypographyProps={{
					noWrap: true,
					component: 'span',
					variant: active ? 'subtitle2' : 'body2',
				}}
				secondaryTypographyProps={{
					noWrap: true,
					variant: 'caption'
				}}
			/>

			{info && (
				<Box component='span' sx={{ lineHeight: 0 }}>
					{info}
				</Box>
			)}

			{
				item.id === 'recruitment' && <ChevronRightIcon sx={{ transition: '0.25s ease', width: '28px', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }} />
			}
			{/* {depth === 1 && <Iconify width={28} icon={open ? 'mdi:chevron-down' : 'mdi:chevron-right'} sx={{ ml: 1, flexShrink: 0 }} />} */}
		</StyledItem>
	);

	const handleActionClick = () => {
		actionHandler(action, title);

		if (!isDesktop) {
			onCloseNav();
		}
	}

	const renderItem = () => {
		// ExternalLink
		if (isExternalLink)
			return (
				<Link href={path} target='_blank' rel='noopener' underline='none'>
					{renderContent}
				</Link>
			);

		// Has child
		if (children || disabled) {
			return renderContent;
		}

		// Is a workspace link that will just open a workspace output card
		if (action) {
			return (
				<Box onClick={handleActionClick}>
					{renderContent}
				</Box>
			)
		}

		// Default
		if (root || settingsLink) {
			return (
				<Link component={RouterLink} href={path} action={action} underline='none'>
					{renderContent}
				</Link>
			);
		}

		return (
			<Box onClick={() => { }}>
				{renderContent}
			</Box>
		)
	};

	return (
		<>
			{!item.hidden && <RoleBasedGuard roles={roles}> {renderItem()} </RoleBasedGuard>}
		</>
	);
}
